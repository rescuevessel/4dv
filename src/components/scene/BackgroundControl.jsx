export default function BackgroundControl({
  type,
  onTypeChange,
  color,
  onColorChange,
  gradientColors,
  onGradientChange,
}) {
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
      <p>Background Control</p>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          width: "100%",
        }}
      >
        <option value="texture">Texture</option>
        <option value="color">Solid Color</option>
        <option value="gradient">Color Gradient</option>
      </select>
      {type === "color" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "8px",
            borderRadius: "4px",
            width: "100%",
          }}
        >
          <label style={{ fontSize: "14px" }}>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            style={{
              width: "30px",
              height: "30px",
              padding: "0",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
        </div>
      )}
      {type === "gradient" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "8px",
            borderRadius: "4px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontSize: "14px" }}>Top:</label>
            <input
              type="color"
              value={gradientColors.top}
              onChange={(e) =>
                onGradientChange({ ...gradientColors, top: e.target.value })
              }
              style={{
                width: "30px",
                height: "30px",
                padding: "0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontSize: "14px" }}>Bottom:</label>
            <input
              type="color"
              value={gradientColors.bottom}
              onChange={(e) =>
                onGradientChange({ ...gradientColors, bottom: e.target.value })
              }
              style={{
                width: "30px",
                height: "30px",
                padding: "0",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
