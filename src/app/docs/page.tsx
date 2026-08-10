import type { Metadata } from "next";
import SwaggerDocs from "@/components/SwaggerDocs";

export const metadata: Metadata = {
  title: "API Docs | Figureforge",
  description: "Interactive Swagger documentation for the Figureforge API.",
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SwaggerDocs url="/api/docs" />
    </main>
  );
}
