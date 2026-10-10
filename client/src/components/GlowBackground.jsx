import React from "react";

const GlowBackground = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* Top Left Electric Lime Ambient Glow */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[110px] opacity-45 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #c8f53c 0%, rgba(200, 245, 60, 0.25) 45%, transparent 70%)",
        }}
      />

      {/* Top Right Soft Lavender Ambient Glow */}
      <div
        className="absolute top-0 -right-24 w-[550px] h-[550px] rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a78bfa 0%, rgba(167, 139, 250, 0.2) 45%, transparent 70%)",
        }}
      />

      {/* Bottom Left Subtle Cyan Glow */}
      <div
        className="absolute bottom-10 left-1/4 w-[480px] h-[480px] rounded-full blur-[100px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, rgba(56, 189, 248, 0.15) 45%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default GlowBackground;
