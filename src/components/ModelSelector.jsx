import React from "react"

const buttonStyle = {
  padding: "8px 16px",
  marginRight: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "14px",
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
  modelList,
}) {
  return (
    <select
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
      style={buttonStyle}
    >
      {modelList.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  )
}
