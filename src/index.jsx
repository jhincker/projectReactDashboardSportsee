import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { PeriodProvider } from "./context/PeriodContext";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <UserProvider>
      <PeriodProvider>
        <App />
      </PeriodProvider>
    </UserProvider>
  </React.StrictMode>,
);
