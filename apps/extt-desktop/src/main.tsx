import React from "react";
import ReactDOM from "react-dom/client";
// import { Store } from "tauri-plugin-store-api";

import { App } from "#/App";
import { App as DevApp } from "#/dev/App";
import { store } from "#/store";
import { StoreContext } from "#//StoreContext";

import "./styles.css";
import { Provider } from "react-redux";

if (window.hasOwnProperty("__TAURI__")) {
  // TODO
  // const store = new Store(".settings.dat");

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
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

            remove: (key) =>
              new Promise((r) => {
                localStorage.removeItem(key);
                r(true);
              }),

            // set: store.set,
            // get: store.get,
            // has: store.has,
            // delete: store.delete,
          }}
        >
          <App />
        </StoreContext.Provider>
      </Provider>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <DevApp />
    </React.StrictMode>
  );
}
