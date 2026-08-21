import { describe, it, expect } from "vitest";
import {
  scrapeArticle,
  translateArticle,
  discoverCandidates,
} from "@/lib/web-articles";

describe("scrapeArticle", () => {
  it("extracts title and markdown from an HTML page", async () => {
    const result = await scrapeArticle(
      "https://im-a-collector.com/en/collecting-differently/how-to-start-an-anime-figure-collection-beginners-guide/"
    );
    expect(result).not.toBeNull();
    expect(result!.title).toBeTruthy();
    expect(result!.markdown).toBeTruthy();
    expect(result!.markdown.length).toBeGreaterThan(200);
    expect(result!.siteName).toBeTruthy();
  }, 30000);

  it("returns null for unreachable URLs", async () => {
    const result = await scrapeArticle("https://nonexistent-domain-12345.invalid/article");
    expect(result).toBeNull();
  }, 15000);
});

describe("translateArticle", () => {
  it("translates English text to Farsi", async () => {
    const result = await translateArticle(
      { title: "Hello World", excerpt: "A test article", body: "This is a test paragraph." },
      "fa"
    );
    expect(result.title).toBeTruthy();
    expect(result.title).not.toBe("Hello World");
  }, 20000);

  it("translates English text to Arabic", async () => {
    const result = await translateArticle(
      { title: "Hello World", excerpt: "A test article", body: "This is a test paragraph." },
      "ar"
    );
    expect(result.title).toBeTruthy();
    expect(result.title).not.toBe("Hello World");
  }, 20000);
});

describe("discoverCandidates", () => {
  it("returns at least one candidate", async () => {
    const candidates = await discoverCandidates();
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0].url).toBeTruthy();
    expect(candidates[0].title).toBeTruthy();
  }, 30000);
});
