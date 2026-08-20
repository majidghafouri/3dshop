import { describe, it, expect } from "vitest";
import { ok, fail, parseJson } from "@/lib/api";

describe("ok", () => {
  it("returns success response with data", async () => {
    const res = ok({ name: "test" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toEqual({ name: "test" });
  });

  it("uses custom status code", async () => {
    const res = ok({ created: true }, 201);
    expect(res.status).toBe(201);
  });
});

describe("fail", () => {
  it("returns error response with message", async () => {
    const res = fail("invalid_input");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("invalid_input");
  });

  it("uses custom status code", async () => {
    const res = fail("unauthorized", 401);
    expect(res.status).toBe(401);
  });

  it("includes extra fields", async () => {
    const res = fail("error", 400, { detail: "more info" });
    const body = await res.json();
    expect(body.detail).toBe("more info");
  });
});

describe("parseJson", () => {
  it("parses valid JSON", () => {
    expect(parseJson('{"key":"value"}')).toEqual({ key: "value" });
  });

  it("returns null for invalid JSON", () => {
    expect(parseJson("not json")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseJson("")).toBeNull();
  });

  it("parses arrays", () => {
    expect(parseJson("[1,2,3]")).toEqual([1, 2, 3]);
  });

  it("preserves types", () => {
    const result = parseJson<{ num: number; str: string }>(
      '{"num":42,"str":"hello"}'
    );
    expect(result?.num).toBe(42);
    expect(result?.str).toBe("hello");
  });
});
