import { useState, useCallback } from "react"

const dialogStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 1000,
  minWidth: "300px",
}

const dropZoneStyle = {
  border: "2px dashed #ccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  marginBottom: "20px",
  cursor: "pointer",
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "20px",
  borderRadius: "4px",
  border: "1px solid #ccc",
}

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "#646cff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "8px",
}

const errorStyle = {
  color: "red",
  marginBottom: "10px",
  fontSize: "14px",
}

const successStyle = {
  color: "green",
  marginBottom: "10px",
  fontSize: "14px",
}

export default function ModelUploadDialog({ onClose, onUpload, isUploading, error, success }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith(".glb")) {
      setFile(droppedFile)
      setName(droppedFile.name.replace(".glb", ""))
    }
  }, [])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith(".glb")) {
      setFile(selectedFile)
      setName(selectedFile.name.replace(".glb", ""))
    }
  }

  const handleUpload = () => {
    if (file && name) {
      onUpload(file, name)
    }
  }

  return (
    <div style={dialogStyle}>
      <h3>Upload Model</h3>
      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>{success}</div>}
      <div
        style={{
          ...dropZoneStyle,
          backgroundColor: isDragging ? "#f0f0f0" : "white",
          opacity: isUploading ? 0.5 : 1,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById("fileInput").click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".glb"
          style={{ display: "none" }}
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        {isUploading ? (
          <p>Uploading...</p>
        ) : file ? (
          <p>Selected file: {file.name}</p>
        ) : (
          <p>Drag and drop a .glb file here or click to select</p>
        )}
      </div>
      <input
        type="text"
        placeholder="Model name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        disabled={isUploading}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
          style={buttonStyle}
          disabled={isUploading}
        >
          {success ? "Close" : "Cancel"}
        </button>
        {!success && (
          <button
            onClick={handleUpload}
            style={{
              ...buttonStyle,
              backgroundColor: file && name && !isUploading ? "#646cff" : "#ccc",
            }}
            disabled={!file || !name || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>
    </div>
  )
} 