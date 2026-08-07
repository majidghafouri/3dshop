export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Figurize API",
    description:
      "REST API for the Figurize figure shop. All responses use the envelope `{ ok: boolean, data?: any, error?: string }`. Authentication is cookie-based via the `figurize_session` cookie (HttpOnly), issued by `POST /api/auth/verify-otp`. Admin endpoints require a user with role `ADMIN`.\n\nTo try authenticated requests from this UI, first sign in on the site, then the session cookie is sent automatically for same-origin calls.",
    version: "1.0.0",
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Auth", description: "Phone OTP authentication" },
    { name: "Cart", description: "Shopping cart (guest or logged-in)" },
    { name: "Orders", description: "Checkout and orders" },
    { name: "Admin · Products", description: "Product management (admin only)" },
    { name: "Admin · Categories", description: "Category management (admin only)" },
    { name: "Admin · Orders", description: "Order management (admin only)" },
    { name: "Admin · Theme", description: "Site appearance / palette (admin only)" },
  ],
  paths: {
    "/api/auth/send-otp": {
      post: {
        tags: ["Auth"],
        summary: "Send a one-time login code",
        description:
          "Creates the user if missing and stores a 5-digit code (valid 5 minutes). In non-production environments the code is returned as `devCode`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phone"],
                properties: {
                  phone: { type: "string", example: "09120000000", description: "Iranian mobile; digits, 0-prefix or 98-prefix accepted" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Code sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        phone: { type: "string", example: "09120000000" },
                        expiresIn: { type: "integer", example: 300 },
                        devCode: { type: "string", description: "Only in non-production", example: "48213" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid phone number",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/auth/verify-otp": {
      post: {
        tags: ["Auth"],
        summary: "Verify the code and sign in",
        description:
          "Validates the code, sets the `figurize_session` cookie, and merges the guest cart. 5 failed attempts consume the code.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phone", "code"],
                properties: {
                  phone: { type: "string", example: "09120000000" },
                  code: { type: "string", example: "48213", description: "5-digit code" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Signed in; session cookie set",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid/expired phone or code",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the current session user",
        responses: {
          "200": {
            description: "Current user, or `data: null` when signed out",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: {
                      oneOf: [{ $ref: "#/components/schemas/User" }, { type: "null" }],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Clear the session cookie",
        responses: {
          "200": {
            description: "Signed out",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: { type: "object", properties: { loggedOut: { type: "boolean", example: true } } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get the cart items",
        description: "Creates a cart on first use and returns it with a `cart_token` cookie.",
        responses: {
          "200": {
            description: "Cart items",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } } } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cart"],
        summary: "Add a product to the cart",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: {
                  productId: { type: "string", example: "clx1..." },
                  quantity: { type: "integer", example: 1, description: "Clamped to 1..stock" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated cart",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } } } },
                  },
                },
              },
            },
          },
          "400": { description: "Missing product or cart error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "404": { description: "Product not found / inactive", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/cart/items/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Cart item id",
        },
      ],
      patch: {
        tags: ["Cart"],
        summary: "Update item quantity",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  quantity: { type: "integer", example: 2, minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated cart",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } } } } } } } },
          },
          "404": { description: "Item not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove an item from the cart",
        responses: {
          "200": {
            description: "Updated cart",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } } } } } } } },
          },
          "404": { description: "Item not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "List my orders",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Orders for the current user",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { orders: { type: "array", items: { $ref: "#/components/schemas/Order" } } } } } } } },
          },
          "401": { description: "Not signed in", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Place an order from the cart",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "phone", "address"],
                properties: {
                  fullName: { type: "string", example: "علی رضایی" },
                  phone: { type: "string", example: "09120000000" },
                  address: { type: "string", example: "تهران، خیابان ..." },
                  postalCode: { type: "string", example: "1234567890" },
                  note: { type: "string" },
                  paymentMethod: {
                    type: "string",
                    enum: ["ZARINPAL", "SNAPPAY", "CASH_ON_DELIVERY", "GATEWAY_PLACEHOLDER"],
                    example: "CASH_ON_DELIVERY",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created; cart cleared and stock decremented",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { order: { $ref: "#/components/schemas/Order" } } } } } } },
          },
          "401": { description: "Not signed in", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "400": { description: "Missing fields / empty cart / stock changed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/orders/admin/{id}/status": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Order id",
        },
      ],
      patch: {
        tags: ["Admin · Orders"],
        summary: "Update an order status (admin)",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
                    example: "SHIPPED",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated order",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { order: { $ref: "#/components/schemas/Order" } } } } } } },
          },
          "401": { description: "Not signed in or not admin", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "400": { description: "Invalid status", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/admin/products": {
      get: {
        tags: ["Admin · Products"],
        summary: "List all products (admin)",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Products with translations and category",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { products: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Admin · Products"],
        summary: "Create a product (admin)",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductPayload" },
            },
          },
        },
        responses: {
          "201": {
            description: "Product created",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { product: { $ref: "#/components/schemas/Product" } } } } } } },
          },
          "400": { description: "Missing slug or name", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/admin/products/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Product id",
        },
      ],
      patch: {
        tags: ["Admin · Products"],
        summary: "Update a product (admin)",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductPayload" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated product",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { product: { $ref: "#/components/schemas/Product" } } } } } } },
          },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Admin · Products"],
        summary: "Delete a product (admin)",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Deleted",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { deleted: { type: "boolean", example: true } } } } } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/admin/categories": {
      get: {
        tags: ["Admin · Categories"],
        summary: "List categories (admin)",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Categories with translation and product count",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { categories: { type: "array", items: { $ref: "#/components/schemas/Category" } } } } } } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      post: {
        tags: ["Admin · Categories"],
        summary: "Create a category (admin)",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["slug", "name"],
                properties: {
                  slug: { type: "string", example: "anime-figure" },
                  image: { type: "string" },
                  sortOrder: { type: "integer", example: 0 },
                  isActive: { type: "boolean", example: true },
                  name: { type: "object", additionalProperties: { type: "string" }, example: { fa: "فیگور انیمه", en: "Anime Figure", ar: "فيجور أنمي" } },
                  description: { type: "object", additionalProperties: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Category created",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { category: { $ref: "#/components/schemas/Category" } } } } } } },
          },
          "400": { description: "Missing slug or name", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/admin/categories/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Category id",
        },
      ],
      patch: {
        tags: ["Admin · Categories"],
        summary: "Update a category (admin)",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  slug: { type: "string" },
                  image: { type: "string" },
                  sortOrder: { type: "integer" },
                  isActive: { type: "boolean" },
                  name: { type: "object", additionalProperties: { type: "string" } },
                  description: { type: "object", additionalProperties: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated category",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { category: { $ref: "#/components/schemas/Category" } } } } } } },
          },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Admin · Categories"],
        summary: "Delete a category (admin)",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Deleted",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { deleted: { type: "boolean", example: true } } } } } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/admin/theme": {
      get: {
        tags: ["Admin · Theme"],
        summary: "Get the site palette and presets (admin)",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Current palette and available presets",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { palette: { $ref: "#/components/schemas/Palette" }, presets: { type: "array", items: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, palette: { $ref: "#/components/schemas/Palette" } } } } } } } } } },
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      patch: {
        tags: ["Admin · Theme"],
        summary: "Update the site palette (admin)",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["palette"],
                properties: {
                  palette: { $ref: "#/components/schemas/Palette" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Palette saved",
            content: { "application/json": { schema: { type: "object", properties: { ok: { type: "boolean", example: true }, data: { type: "object", properties: { palette: { $ref: "#/components/schemas/Palette" } } } } } } },
          },
          "400": { description: "Invalid palette", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "figurize_session",
        description: "Session JWT issued by POST /api/auth/verify-otp.",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: false },
          error: { type: "string", example: "invalid_code" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          phone: { type: "string", example: "09120000000" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          name: { type: "string", nullable: true },
        },
      },
      CartItem: {
        type: "object",
        description: "Cart line with the localized product embedded.",
        properties: {
          id: { type: "string" },
          quantity: { type: "integer" },
          product: { type: "object", description: "Product fields (localized)" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          status: { type: "string", enum: ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] },
          paymentMethod: { type: "string" },
          fullName: { type: "string" },
          phone: { type: "string" },
          address: { type: "string" },
          postalCode: { type: "string", nullable: true },
          note: { type: "string", nullable: true },
          subtotal: { type: "number" },
          shipping: { type: "number" },
          discount: { type: "number" },
          total: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          items: { type: "array", items: { type: "object" } },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          sku: { type: "string", nullable: true },
          brand: { type: "string", nullable: true },
          price: { type: "number" },
          compareAtPrice: { type: "number", nullable: true },
          stock: { type: "integer" },
          isActive: { type: "boolean" },
          isFeatured: { type: "boolean" },
          isSpecial: { type: "boolean" },
          hasDiscount: { type: "boolean" },
          images: { type: "array", items: { type: "string" } },
          musicUrl: { type: "string", nullable: true },
          musicTitle: { type: "string", nullable: true },
          translations: { type: "array", items: { type: "object" } },
        },
      },
      ProductPayload: {
        type: "object",
        description:
          "Translations (`name`, `shortDescription`, `description`, `features`) are maps keyed by locale (`fa`, `en`, `ar`).",
        properties: {
          slug: { type: "string", example: "geralt-witcher-3" },
          sku: { type: "string" },
          categorySlug: { type: "string" },
          brand: { type: "string" },
          price: { type: "number", example: 2500000 },
          compareAtPrice: { type: "number", example: 3000000 },
          stock: { type: "integer", example: 10 },
          isActive: { type: "boolean", example: true },
          isFeatured: { type: "boolean" },
          isSpecial: { type: "boolean" },
          heightCm: { type: "string" },
          material: { type: "string" },
          weightGrams: { type: "number" },
          images: { type: "array", items: { type: "string", format: "uri" } },
          musicUrl: { type: "string", format: "uri" },
          musicTitle: { type: "string" },
          name: { type: "object", additionalProperties: { type: "string" }, example: { fa: "گرالت", en: "Geralt", ar: "جيرالت" } },
          shortDescription: { type: "object", additionalProperties: { type: "string" } },
          description: { type: "object", additionalProperties: { type: "string" } },
          features: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string" },
          slug: { type: "string" },
          image: { type: "string", nullable: true },
          sortOrder: { type: "integer" },
          isActive: { type: "boolean" },
          translations: { type: "array", items: { type: "object" } },
        },
      },
      Palette: {
        type: "object",
        required: ["light", "dark"],
        properties: {
          light: { $ref: "#/components/schemas/PaletteMode" },
          dark: { $ref: "#/components/schemas/PaletteMode" },
        },
      },
      PaletteMode: {
        type: "object",
        required: ["primary", "sky", "teal"],
        properties: {
          primary: { type: "string", format: "color", example: "#3454d1" },
          sky: { type: "string", format: "color", example: "#169ed9" },
          teal: { type: "string", format: "color", example: "#15c8b8" },
        },
      },
    },
  },
} as const;

export type OpenApiSpec = typeof openApiSpec;
