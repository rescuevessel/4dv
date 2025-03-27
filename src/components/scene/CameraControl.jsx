export default function CameraControl({ onResetCamera }) {
  return (
    <div
      style={{
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: "12px",
        borderRadius: "8px",
        gap: "8px",
      }}
    >
      <p>Camera Control</p>
      <button
        onClick={onResetCamera}
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
        <span style={{ fontSize: "16px" }}>🎥</span>
        Reset Camera
      </button>
    </div>
  )
}
