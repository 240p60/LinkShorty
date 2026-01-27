import WebApp from "@twa-dev/sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Initialize Telegram Web App
WebApp.ready();
WebApp.expand();

// biome-ignore lint/style/noNonNullAssertion: root element is always present
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
