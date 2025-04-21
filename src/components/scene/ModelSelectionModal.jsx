import { useState } from "react"

export default function ModelSelectionModal({
  models,
  onClose,
  onModelSelect,
  onUpload,
  isUploading,
  uploadError,
  uploadSuccess,
  onDelete,
  onRename,
}) {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [modelName, setModelName] = useState("")
  const [deletingModel, setDeletingModel] = useState(null)
  const [renamingModel, setRenamingModel] = useState(null)
  const [newName, setNewName] = useState("")

  const handleUpload = async () => {
    if (!selectedFile || !modelName) return
    await onUpload(selectedFile, modelName)
    setSelectedFile(null)
    setModelName("")
    setShowUploadDialog(false)
  }

  const handleDelete = async (model) => {
    setDeletingModel(model.url)
    try {
      await onDelete(model.url)
    } finally {
      setDeletingModel(null)
    }
  }

  const handleRename = async (model) => {
    if (!newName.trim()) return
    setRenamingModel(model.url)
    try {
      const result = await onRename(model.url, newName.trim())
      if (result.success) {
        setRenamingModel(null)
        setNewName("")
      } else {
        console.error("Failed to rename model:", result.error)
        // You could add a visual error message here if needed
      }
    } catch (error) {
      console.error("Error in handleRename:", error)
      setRenamingModel(null)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "800px",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Change Model</h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "black",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setShowUploadDialog(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#646cff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Upload New Model
          </button>
        </div>

        {showUploadDialog && (
          <div
            style={{
              marginBottom: "20px",
              padding: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Upload New Model</h3>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ marginBottom: "10px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Model Name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #646cff",
                  backgroundColor: "transparent",
                  color: "white",
                  width: "100%",
                }}
              />
            </div>
            {uploadError && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div style={{ color: "green", marginBottom: "10px" }}>
                {uploadSuccess}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !modelName}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#646cff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  opacity: isUploading || !selectedFile || !modelName ? 0.5 : 1,
                }}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={() => {
                  setShowUploadDialog(false)
                  setSelectedFile(null)
                  setModelName("")
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "white",
                  border: "1px solid white",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #646cff",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #646cff",
                  }}
                >
                  Upload Date
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    borderBottom: "1px solid #646cff",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model.url}
                  onClick={() => onModelSelect(model.url)}
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    ":hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <td style={{ padding: "10px" }}>
                    {renamingModel === model.url ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #646cff",
                          width: "100%",
                        }}
                      />
                    ) : (
                      model.name
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {new Date(model.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {renamingModel === model.url ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRename(model)
                          }}
                          disabled={!newName.trim()}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#646cff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            opacity: !newName.trim() ? 0.5 : 1,
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setRenamingModel(model.url)
                            setNewName(model.name)
                          }}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "transparent",
                            color: "#646cff",
                            border: "1px solid #646cff",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Rename
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(model)
                        }}
                        disabled={deletingModel === model.url}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "transparent",
                          color: "#ff4444",
                          border: "1px solid #ff4444",
                          borderRadius: "4px",
                          cursor: "pointer",
                          opacity: deletingModel === model.url ? 0.5 : 1,
                        }}
                      >
                        {deletingModel === model.url ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
