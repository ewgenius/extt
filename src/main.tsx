import "./globals.css";
import React from "react";
import ReactDOM from "react-dom/client";
// import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
// import { type } from "@tauri-apps/plugin-os";
import { App } from "./App";

// const osType = type();
// if (osType !== "macos") {
//   await getCurrentWebviewWindow().setDecorations(false);
// }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
