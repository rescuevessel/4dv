import ModelSelector from "../ModelSelector"

export default function ModelControl({
  selectedModel,
  onModelChange,
  modelList,
  modelColor,
  onModelColorChange,
  showEdges,
  onToggleEdges,
  useColor,
  onUseColorChange,
  modelScale,
  onModelScaleChange,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        padding: "12px",
        borderRadius: "8px",
        gap: "8px",
      }}
    >
      <p>Model Control</p>
      <ModelSelector
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        modelList={modelList}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="checkbox"
            id="useColor"
            checked={useColor}
            onChange={(e) => onUseColorChange(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          <label htmlFor="useColor" style={{ fontSize: "14px" }}>
            Color Model:
          </label>
        </div>
        {useColor && (
          <input
            type="color"
            value={modelColor}
            onChange={(e) => onModelColorChange(e.target.value)}
            style={{
              width: "30px",
              height: "30px",
              padding: "0",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
        )}
      </div>
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
        <label style={{ fontSize: "14px", color: "white" }}>Scale:</label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={modelScale}
          onChange={(e) => onModelScaleChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            cursor: "pointer",
          }}
        />
        <span style={{ fontSize: "14px", color: "white", minWidth: "40px" }}>
          {modelScale.toFixed(1)}x
        </span>
      </div>
      <button
        onClick={onToggleEdges}
        style={{
          padding: "8px 16px",
          backgroundColor: showEdges ? "#646cff" : "#fff",
          color: showEdges ? "#fff" : "#000",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "16px" }}>📐</span>
        {showEdges ? "Hide Edges" : "Show Edges"}
      </button>
    </div>
  )
}
