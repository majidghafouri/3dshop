"use client";

import "swagger-ui-react/swagger-ui.css";
import SwaggerUI from "swagger-ui-react";

export default function SwaggerDocs({ url }: { url: string }) {
  return <SwaggerUI url={url} tryItOutEnabled defaultModelRendering="model" />;
}
