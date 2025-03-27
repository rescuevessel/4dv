import React from "react"

const buttonStyle = {
  padding: "8px 16px",
  marginRight: "8px",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  whiteSpace: "nowrap",
  border: "1px solid #ccc",
  borderRadius: "4px",
  minWidth: "fit-content",
}

const containerStyle = {
  display: "flex",
  alignItems: "center",
  marginRight: "8px",
  position: "relative",
}

const messageStyle = {
  position: "absolute",
  top: "-20px",
  left: "50%",
  transform: "translateX(-50%)",
  whiteSpace: "nowrap",
  fontSize: "12px",
}

export default function ControlButtons({
  onSaveState,
  onRestoreState,
  saveMsg,
  restoreMsg,
}) {
  return (
    <>
      <div style={containerStyle}>
        <button onClick={onSaveState} style={buttonStyle}>
          💾 Save State
        </button>
        <div style={messageStyle}>{saveMsg}</div>
      </div>

      <div style={containerStyle}>
        <button onClick={onRestoreState} style={buttonStyle}>
          ↩️ Restore State
        </button>
        <div style={messageStyle}>{restoreMsg}</div>
      </div>
    </>
  )
}
