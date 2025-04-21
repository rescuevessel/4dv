import React, { useState } from "react"
import { uploadModel } from "../utils/modelUtils"

export default function ModelUploader({ onModelUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) return

      setUploading(true)
      setError(null)

      await uploadModel(file)

      // Call callback to refresh models list
      if (onModelUploaded) {
        onModelUploaded()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".glb"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
      {error && <span>Error: {error}</span>}
    </div>
  )
}
