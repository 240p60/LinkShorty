import { init } from "@tma.js/sdk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

init({ acceptCustomStyles: true });

// biome-ignore lint/style/noNonNullAssertion: root element is always present
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
