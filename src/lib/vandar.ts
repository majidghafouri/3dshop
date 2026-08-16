import { getSetting } from "@/lib/settings";

const VANDAR_API_BASE = "https://ipg.vandar.io/api/v4";
const VANDAR_REDIRECT_BASE = "https://ipg.vandar.io/v4";

export type VandarSendResponse = {
  status: number;
  token: string;
  message?: string;
};

export type VandarTransaction = {
  status: number;
  amount: string;
  wage: string;
  shaparakWage: string;
  transId: number;
  refnumber: string;
  trackingCode: string;
  factorNumber: string | null;
  mobile: string | null;
  description: string | null;
  cardNumber: string;
  CID: string;
  createdAt: string;
  paymentDate: string;
  code: number;
  message: string;
  wage_transaction: string | null;
};

export type VandarVerifyResponse = {
  status: number;
  amount: string;
  realAmount: number;
  wage: string;
  shaparakWage: string;
  transId: number;
  factorNumber: string | null;
  mobile: string | null;
  description: string | null;
  cardNumber: string;
  paymentDate: string;
  cid: string | null;
  message: string;
  wage_transaction: string | null;
};

export type PaymentError = {
  ok: false;
  error: string;
  status?: number;
};

export type PaymentResult = {
  ok: true;
  status: number;
  amount: string;
  realAmount: number;
  wage: string;
  transId: number;
  factorNumber: string | null;
  mobile: string | null;
  cardNumber: string;
  paymentDate: string;
  message: string;
};

/** Resolve the Vandar API key from the database Setting table or env. */
export async function getVandarApiKey(): Promise<string | null> {
  const fromSetting = await getSetting("vandar_api_key");
  if (fromSetting) return fromSetting;
  return process.env.VANDAR_API_KEY ?? null;
}

/** Build the absolute callback URL that Vandar will redirect to after payment. */
export function getVandarCallbackUrl(orderId: string): string {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return `${base}/pay/${orderId}/callback`;
}

/**
 * Step 1: Send transaction data to Vandar IPG and receive a payment token.
 */
export async function createVandarPayment(params: {
  amount: number;
  callbackUrl: string;
  mobileNumber?: string;
  factorNumber?: string;
  description?: string;
  nationalCode?: string;
  validCardNumber?: string[];
  comment?: string;
  port?: "SAMAN" | "BEHPARDAKHT";
  terminalId?: string;
}): Promise<{ ok: true; token: string } | PaymentError> {
  const apiKey = await getVandarApiKey();
  if (!apiKey) return { ok: false, error: "vandar_api_key_not_configured" };

  const payload: Record<string, unknown> = {
    api_key: apiKey,
    amount: params.amount,
    callback_url: params.callbackUrl,
  };
  if (params.mobileNumber) payload.mobile_number = params.mobileNumber;
  if (params.factorNumber) payload.factorNumber = params.factorNumber;
  if (params.description) payload.description = params.description;
  if (params.nationalCode) payload.national_code = params.nationalCode;
  if (params.validCardNumber) payload.valid_card_number = params.validCardNumber;
  if (params.comment) payload.comment = params.comment;
  if (params.port) payload.port = params.port;
  if (params.terminalId) payload.terminal_id = params.terminalId;

  let res: Response;
  try {
    res = await fetch(`${VANDAR_API_BASE}/send`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "network_error" };
  }

  const data = (await res.json().catch(() => ({}))) as Partial<VandarSendResponse>;
  if (!res.ok || data.status !== 1 || !data.token) {
    return {
      ok: false,
      error: data.message ?? `vandar_send_failed`,
      status: res.status,
    };
  }

  return { ok: true, token: data.token };
}

/**
 * Step 3: Retrieve transaction info before verification (optional).
 */
export async function getVandarTransaction(
  token: string,
): Promise<{ ok: true; transaction: VandarTransaction } | PaymentError> {
  const apiKey = await getVandarApiKey();
  if (!apiKey) return { ok: false, error: "vandar_api_key_not_configured" };

  let res: Response;
  try {
    res = await fetch(`${VANDAR_API_BASE}/transaction`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api_key: apiKey, token }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "network_error" };
  }

  const data = (await res.json().catch(() => ({}))) as Partial<VandarTransaction>;
  if (!res.ok || data.status !== 1) {
    return {
      ok: false,
      error: data.message ?? "vandar_transaction_failed",
      status: res.status,
    };
  }

  return { ok: true, transaction: data as VandarTransaction };
}

/**
 * Step 4: Verify a completed payment transaction.
 * This should be called exactly once per transaction to finalize it.
 */
export async function verifyVandarPayment(token: string): Promise<PaymentResult | PaymentError> {
  const apiKey = await getVandarApiKey();
  if (!apiKey) return { ok: false, error: "vandar_api_key_not_configured" };

  let res: Response;
  try {
    res = await fetch(`${VANDAR_API_BASE}/verify`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api_key: apiKey, token }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "network_error" };
  }

  const data = (await res.json().catch(() => ({}))) as Partial<VandarVerifyResponse>;
  if (!res.ok || data.status !== 1) {
    return {
      ok: false,
      error: data.message ?? "vandar_verify_failed",
      status: res.status,
    };
  }

  return {
    ok: true,
    status: data.status,
    amount: data.amount ?? "0",
    realAmount: data.realAmount ?? 0,
    wage: data.wage ?? "0",
    transId: data.transId ?? 0,
    factorNumber: data.factorNumber ?? null,
    mobile: data.mobile ?? null,
    cardNumber: data.cardNumber ?? "",
    paymentDate: data.paymentDate ?? "",
    message: data.message ?? "ok",
  };
}

/**
 * Build the browser redirect URL for the user to complete payment.
 */
export function getVandarRedirectUrl(token: string): string {
  return `${VANDAR_REDIRECT_BASE}/${token}`;
}
