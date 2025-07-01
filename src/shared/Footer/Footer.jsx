import React from "react";

const Footer = ({ footerRef }) => {
  return (
    <div
      ref={footerRef}
      className="py-4 text-center"
      style={{
        backgroundColor: "#1E293B",
        // position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <p className="text-sm text-white font-lora">
        © 2025 PawConnect. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
