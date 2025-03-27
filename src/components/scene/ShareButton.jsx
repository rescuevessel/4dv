export default function ShareLinkButton({ onShareLink, shareMsg }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
        position: "relative",
      }}
    >
      <button
        onClick={onShareLink}
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
        <span style={{ fontSize: "16px" }}>🔗</span>
        Share Link
      </button>
      {shareMsg && (
        <div
          style={{
            position: "absolute",
            top: "-20px",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontSize: "12px",
            color: "white",
          }}
        >
          {shareMsg}
        </div>
      )}
    </div>
  )
}
