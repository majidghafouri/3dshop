import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { ok, fail, parseJson } from "@/lib/api";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user) return fail("unauthorized", 401);

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return ok({ orders });
}

const PAYMENT_METHODS = [
  "ZARINPAL",
  "SNAPPAY",
  "CASH_ON_DELIVERY",
  "GATEWAY_PLACEHOLDER",
] as const;

export async function POST(req: NextRequest) {
  const user = await getSessionUserFromRequest(req);
  if (!user) return fail("unauthorized", 401);

  const body = parseJson<{
    fullName?: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    note?: string;
    paymentMethod?: string;
  }>(await req.text());

  if (!body?.fullName || !body?.phone || !body?.address) {
    return fail("fill_required");
  }
  const { fullName, phone, address } = body;
  const paymentMethod = PAYMENT_METHODS.includes(
    body.paymentMethod as (typeof PAYMENT_METHODS)[number]
  )
    ? (body.paymentMethod as (typeof PAYMENT_METHODS)[number])
    : "GATEWAY_PLACEHOLDER";

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });
  if (!cart || cart.items.length === 0) return fail("empty_cart");

  let subtotal = 0;
  let discount = 0;
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return fail("stock_changed", 400, { productId: item.product.id });
    }
    subtotal += item.product.price * item.quantity;
    if (item.product.compareAtPrice && item.product.compareAtPrice > item.product.price) {
      discount += (item.product.compareAtPrice - item.product.price) * item.quantity;
    }
  }
  const shipping = 0;
  const total = subtotal;

  const order = await prisma.$transaction(async (tx) => {
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }
    const created = await tx.order.create({
      data: {
        userId: user.id,
        paymentMethod,
        fullName,
        phone,
        address,
        postalCode: body.postalCode ?? null,
        note: body.note ?? null,
        subtotal,
        shipping,
        discount,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: { items: true },
    });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return created;
  });

  return ok({ order }, 201);
}
