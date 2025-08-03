import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WatchLaterProvider } from "./context/WatchLaterContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WatchLaterProvider>
      <App />
      <Toaster position="bottom-center" reverseOrder={false} />
    </WatchLaterProvider>
  </React.StrictMode>
);
