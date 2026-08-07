import type { Metadata } from "next";
import SwaggerDocs from "@/components/SwaggerDocs";

export const metadata: Metadata = {
  title: "API Docs | Figurize",
  description: "Interactive Swagger documentation for the Figurize API.",
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SwaggerDocs url="/api/docs" />
    </main>
  );
}
