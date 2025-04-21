import ModelSelector from "../ModelSelector"
import ModelSelectionModal from "./ModelSelectionModal"
import { useState } from "react"

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
  modelScale = 1,
  onModelScaleChange,
  onUpload,
  isUploading,
  uploadError,
  uploadSuccess,
  onDelete,
  onRename,
}) {
  const [showModal, setShowModal] = useState(false)

  const currentModel = modelList.find((model) => model.url === selectedModel)

  return (
    <div className="control-panel">
      <p className="control-title">Model Control</p>
      <div className="control-stack">
        <span className="control-label">Current Model</span>
        <button className="control-button" onClick={() => setShowModal(true)}>
          {currentModel?.name || "None"}
        </button>
      </div>

      {showModal && (
        <ModelSelectionModal
          models={modelList}
          onClose={() => setShowModal(false)}
          onModelSelect={(url) => {
            onModelChange(url)
            setShowModal(false)
          }}
          onUpload={onUpload}
          isUploading={isUploading}
          uploadError={uploadError}
          uploadSuccess={uploadSuccess}
          onDelete={onDelete}
          onRename={onRename}
        />
      )}

      <div>
        <div className="control-stack">
          <label htmlFor="useColor" className="control-label">
            Color
          </label>
          {useColor && (
            <input
              type="color"
              value={modelColor}
              onChange={(e) => onModelColorChange(e.target.value)}
            />
          )}
        </div>
      </div>
      <div className="control-stack">
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <label className="control-label">Scale</label>
          {/*<span className="control-label">{modelScale.toFixed(1)}x</span>}*/}
        </div>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={modelScale}
          onChange={(e) => onModelScaleChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            cursor: "pointer",
          }}
        />
      </div>
      <div
        className="control-stack"
        style={{
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div
          onClick={onToggleEdges}
          style={{
            position: "relative",
            width: "40px",
            height: "20px",
            backgroundColor: showEdges ? "#646cff" : "#ccc",
            borderRadius: "20px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: showEdges ? "22px" : "2px",
              width: "16px",
              height: "16px",
              backgroundColor: "white",
              borderRadius: "50%",
              transition: "left 0.2s",
            }}
          />
        </div>
        <label className="control-label">Show Edges</label>
      </div>
    </div>
  )
}
