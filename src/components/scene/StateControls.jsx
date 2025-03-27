export default function StateControls({
  onSaveState,
  onRestoreState,
  saveMsg,
  restoreMsg,
}) {
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
      <select
        onChange={(e) => {
          if (e.target.value === "save") {
            onSaveState()
          } else if (e.target.value === "restore") {
            onRestoreState()
          }
          e.target.value = "" // Reset selection
        }}
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
        <option value="" disabled selected>
          <span style={{ fontSize: "16px" }}>💾</span> Scenes
        </option>
        <option value="save">💾 Save State</option>
        <option value="restore">↩️ Restore State</option>
      </select>
      {(saveMsg || restoreMsg) && (
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
          {saveMsg || restoreMsg}
        </div>
      )}
    </div>
  )
}
