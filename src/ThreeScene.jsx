import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import SceneSetup, { SetBackground } from "./components/SceneSetup"
import Model from "./components/Model"
import ScreenshotHelper from "./utils/ScreenshotHelper"
import ModelControl from "./components/scene/ModelControl"
import CameraControl from "./components/scene/CameraControl"
import ScreenshotButton from "./components/scene/ScreenshotButton"
import ShareLinkButton from "./components/scene/ShareButton"
import StateControls from "./components/scene/StateControls"
import BackgroundControl from "./components/scene/BackgroundControl"
import ModelUploadDialog from "./components/scene/ModelUploadDialog"
import useSceneState from "./hooks/useSceneState"
import { resetCamera } from "./utils/cameraUtils"
import {
  getDatabaseModels,
  uploadModel,
  deleteModel,
  renameModel,
} from "./utils/supabaseClient"

// Default camera position and target
const DEFAULT_CAMERA_POSITION = [0, 2, 5]
const DEFAULT_CAMERA_TARGET = [0, 0, 0]

export default function ThreeScene() {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const fetchModels = async () => {
    const data = await getDatabaseModels()
    setModels(data)
    if (data.length > 0 && !selectedModel) {
      setSelectedModel(data[0].url)
    }
    return data
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const handleUpload = async (file, name) => {
    setIsUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      const result = await uploadModel(file, name)
      if (!result.success) {
        throw result.error
      }

      // Refresh models and get the latest data
      const updatedModels = await fetchModels()

      // Find the newly uploaded model
      const newModel = updatedModels.find((model) => model.name === name)
      if (newModel) {
        setSelectedModel(newModel.url)
        setUploadSuccess(`Successfully uploaded ${name}!`)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadError(error.message || "Failed to upload model")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (modelUrl) => {
    try {
      await deleteModel(modelUrl)
      const updatedModels = await fetchModels()
      if (selectedModel === modelUrl) {
        setSelectedModel(updatedModels[0]?.url || "")
      }
    } catch (error) {
      console.error("Failed to delete model:", error)
    }
  }

  const handleRename = async (modelUrl, newName) => {
    try {
      const result = await renameModel(modelUrl, newName)
      await fetchModels() // Refresh the model list
      return result
    } catch (error) {
      console.error("Failed to rename model:", error)
      return { success: false, error }
    }
  }

  // Refs
  const screenshotCallback = useRef(() => {})
  const modelRef = useRef()
  const controlsRef = useRef()
  const cameraRef = useRef()

  // Background state
  const [backgroundType, setBackgroundType] = useState("texture")
  const [backgroundColor, setBackgroundColor] = useState("#242424")
  const [gradientColors, setGradientColors] = useState({
    top: "#4a90e2",
    bottom: "#87ceeb",
  })
  const [modelColor, setModelColor] = useState("#ffffff")
  const [showEdges, setShowEdges] = useState(false)
  const [useColor, setUseColor] = useState(true)
  const [modelScale, setModelScale] = useState(25)

  // Scene state management
  const {
    saveMsg,
    restoreMsg,
    shareMsg,
    saveSceneState,
    restoreSceneState,
    handleShareLink,
  } = useSceneState(
    modelRef,
    controlsRef,
    cameraRef,
    models.map((m) => m.url)
  )

  const handleResetCamera = () => {
    resetCamera(cameraRef, controlsRef)
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: 20,

          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ marginLeft: "12px" }}>Pivotal</h1>
        <div style={{ display: "flex", gap: "0px" }}>
          <ScreenshotButton onScreenshot={() => screenshotCallback.current()} />
          <ShareLinkButton onShareLink={handleShareLink} shareMsg={shareMsg} />
          <StateControls
            onSaveState={saveSceneState}
            onRestoreState={restoreSceneState}
            saveMsg={saveMsg}
            restoreMsg={restoreMsg}
          />
        </div>
      </div>

      {showUploadDialog && (
        <ModelUploadDialog
          onClose={() => {
            setShowUploadDialog(false)
            setUploadError(null)
            setUploadSuccess(null)
          }}
          onUpload={handleUpload}
          isUploading={isUploading}
          error={uploadError}
          success={uploadSuccess}
        />
      )}

      <div className="control-panel-container">
        <ModelControl
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          modelList={models}
          modelColor={modelColor}
          onModelColorChange={setModelColor}
          showEdges={showEdges}
          onToggleEdges={() => setShowEdges(!showEdges)}
          useColor={useColor}
          onUseColorChange={setUseColor}
          modelScale={modelScale}
          onModelScaleChange={setModelScale}
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadError={uploadError}
          uploadSuccess={uploadSuccess}
          onDelete={handleDelete}
          onRename={handleRename}
        />
        <BackgroundControl
          type={backgroundType}
          onTypeChange={setBackgroundType}
          color={backgroundColor}
          onColorChange={setBackgroundColor}
          gradientColors={gradientColors}
          onGradientChange={setGradientColors}
        />
        <CameraControl onResetCamera={handleResetCamera} />
      </div>

      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [0, 2, 5], fov: 60 }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <SetBackground
          type={backgroundType}
          color={backgroundColor}
          gradientColors={gradientColors}
        />
        <ScreenshotHelper onReady={(fn) => (screenshotCallback.current = fn)} />
        <SceneSetup controlsRef={controlsRef} cameraRef={cameraRef} />
        {selectedModel && (
          <Model
            url={selectedModel}
            modelRef={modelRef}
            color={useColor ? modelColor : undefined}
            showEdges={showEdges}
            scale={modelScale}
          />
        )}
      </Canvas>
    </>
  )
}
