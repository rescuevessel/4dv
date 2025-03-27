import { useRef } from "react"

export default function ScreenshotButton({ onScreenshot }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <button
        onClick={onScreenshot}
        style={{
          padding: "8px 16px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "16px" }}>📸</span>
        Screenshot
      </button>
    </div>
  )
}
