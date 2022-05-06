import React from "react";
import ReactDOM from "react-dom/client";
// import { Store } from "tauri-plugin-store-api";

import { App } from "#/App";
import { App as DevApp } from "#/dev/App";
import { StoreContext } from "#/StoreContext";

import "./styles.css";

if (window.hasOwnProperty("__TAURI__")) {
  // TODO
  // const store = new Store(".settings.dat");

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <StoreContext.Provider
        value={{
          set: (key, value) =>
            new Promise((r) => {
              localStorage.setItem(key, value as string);
              r();
            }),

          get: (key) =>
            new Promise((r) => {
              const v = localStorage.getItem(key);
              if (v) {
                r(v as any);
              } else {
                r(null);
              }
            }),

          has: (key) => new Promise((r) => r(!!localStorage.getItem(key))),

          // set: store.set,
          // get: store.get,
          // has: store.has,
          // delete: store.delete,
        }}
      >
        <App />
      </StoreContext.Provider>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
