import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import SceneSetup, { SetBackground } from "./components/SceneSetup"
import Model from "./components/Model"
import ScreenshotHelper from "./components/ScreenshotHelper"
import ModelControl from "./components/scene/ModelControl"
import CameraControl from "./components/scene/CameraControl"
import ScreenshotButton from "./components/scene/ScreenshotButton"
import ShareLinkButton from "./components/scene/ShareButton"
import StateControls from "./components/scene/StateControls"
import BackgroundControl from "./components/scene/BackgroundControl"
import useSceneState from "./hooks/useSceneState"

const MODEL_FOLDER = "/models/"
// Get all .glb files from the public/models directory
const modelList = Object.keys(
  import.meta.glob("/public/models/*.glb", { query: "?url", import: "default" })
).map((path) => path.split("/").pop()) // Get just the filename

// Default camera position and target
const DEFAULT_CAMERA_POSITION = [0, 2, 5]
const DEFAULT_CAMERA_TARGET = [0, 0, 0]

export default function ThreeScene() {
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
  const [modelScale, setModelScale] = useState(1)

  // Scene state management
  const {
    selectedModel,
    setSelectedModel,
    saveMsg,
    restoreMsg,
    shareMsg,
    saveSceneState,
    restoreSceneState,
    handleShareLink,
  } = useSceneState(modelRef, controlsRef, cameraRef, modelList)

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      // Set the target to the center
      controlsRef.current.target.set(...DEFAULT_CAMERA_TARGET)

      // Animate the camera position
      const startPosition = cameraRef.current.position.clone()
      const endPosition = new THREE.Vector3(...DEFAULT_CAMERA_POSITION)

      // Create an animation
      const duration = 1000 // 1 second
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Ease out cubic function for smooth deceleration
        const t = 1 - Math.pow(1 - progress, 3)

        // Interpolate position
        cameraRef.current.position.lerpVectors(startPosition, endPosition, t)

        // Update controls
        controlsRef.current.update()

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: 20,
          left: 20,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Pivotal</h2>
        <div style={{ display: "flex", gap: "0px", marginRight: "20px" }}>
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
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 2,
          display: "flex",
          gap: "10px",
        }}
      >
        <ModelControl
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          modelList={modelList}
          modelColor={modelColor}
          onModelColorChange={setModelColor}
          showEdges={showEdges}
          onToggleEdges={() => setShowEdges(!showEdges)}
          useColor={useColor}
          onUseColorChange={setUseColor}
          modelScale={modelScale}
          onModelScaleChange={setModelScale}
        />
        <BackgroundControl
          type={backgroundType}
          onTypeChange={setBackgroundType}
          color={backgroundColor}
          onColorChange={setBackgroundColor}
          gradientColors={gradientColors}
          onGradientChange={setGradientColors}
        />
        <CameraControl onResetCamera={resetCamera} />
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
        <Model
          url={`${MODEL_FOLDER}${selectedModel}`}
          modelRef={modelRef}
          color={useColor ? modelColor : undefined}
          showEdges={showEdges}
          scale={modelScale}
        />
      </Canvas>
    </>
  )
}
