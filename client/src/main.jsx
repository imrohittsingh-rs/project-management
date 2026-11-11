import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#171717",
            border: "1px solid #ebebeb",
            borderRadius: "12px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
            fontFamily: "var(--font-geist)",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#0070f3", secondary: "#ffffff" } },
          error: { iconTheme: { primary: "#ee0000", secondary: "#ffffff" } },
        }}
      />
    </MotionConfig>
  </StrictMode>,
);
