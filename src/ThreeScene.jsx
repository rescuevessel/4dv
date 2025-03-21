import { useState, useRef, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"
import ModelSelector from "./components/ModelSelector"
import ControlButtons from "./components/ControlButtons"
import SceneSetup, { SetBackgroundTexture } from "./components/SceneSetup"
import {
  getSceneStateFromURL,
  generateShareableLink,
  showTempMessage,
} from "./utils/sceneState"

const MODEL_FOLDER = "/models/"
const modelList = ["model1.glb", "model2.glb", "model3.glb"]

function Model({ url, modelRef }) {
  const { scene } = useGLTF(url)
  return <primitive ref={modelRef} object={scene} />
}

function ScreenshotHelper({ onReady }) {
  const { gl, scene, camera } = useThree()
  onReady(() => {
    gl.render(scene, camera)
    const dataURL = gl.domElement.toDataURL("image/jpeg", 0.95)
    const link = document.createElement("a")
    link.href = dataURL
    link.download = `screenshot-${Date.now()}.jpg`
    link.click()
  })
  return null
}

export default function ThreeScene() {
  const [selectedModel, setSelectedModel] = useState(modelList[0])
  const [savedState, setSavedState] = useState(null)
  const screenshotCallback = useRef(() => {})
  const modelRef = useRef()
  const controlsRef = useRef()
  const cameraRef = useRef()

  const [saveMsg, setSaveMsg] = useState("")
  const [restoreMsg, setRestoreMsg] = useState("")
  const [shareMsg, setShareMsg] = useState("")

  useEffect(() => {
    const { modelParam, modelPos, modelRot, camPos, target } =
      getSceneStateFromURL()
    if (modelParam) setSelectedModel(modelParam)

    setTimeout(() => {
      if (modelRef.current && modelPos)
        modelRef.current.position.set(...modelPos)
      if (modelRef.current && modelRot)
        modelRef.current.rotation.set(...modelRot)
      if (cameraRef.current && camPos) cameraRef.current.position.set(...camPos)
      if (controlsRef.current && target) {
        controlsRef.current.target.set(...target)
        controlsRef.current.update()
      }
    }, 500)
  }, [])

  const saveSceneState = () => {
    if (!modelRef.current || !controlsRef.current || !cameraRef.current) return
    const state = {
      model: selectedModel,
      modelPos: modelRef.current.position.toArray(),
      modelRot: modelRef.current.rotation.toArray(),
      camPos: cameraRef.current.position.toArray(),
      target: controlsRef.current.target.toArray(),
    }
    setSavedState(state)
    showTempMessage(setSaveMsg, "✅ Scene saved!")
  }

  const restoreSceneState = () => {
    if (!savedState) return
    setSelectedModel(savedState.model)
    setTimeout(() => {
      modelRef.current.position.set(...savedState.modelPos)
      modelRef.current.rotation.set(...savedState.modelRot)
      cameraRef.current.position.set(...savedState.camPos)
      controlsRef.current.target.set(...savedState.target)
      controlsRef.current.update()
    }, 500)
    showTempMessage(setRestoreMsg, "✅ Scene restored!")
  }

  const handleShareLink = () => {
    if (!modelRef.current || !controlsRef.current || !cameraRef.current) return
    const state = {
      model: selectedModel,
      modelPos: modelRef.current.position.toArray(),
      modelRot: modelRef.current.rotation.toArray(),
      camPos: cameraRef.current.position.toArray(),
      target: controlsRef.current.target.toArray(),
    }
    const shareURL = generateShareableLink(state)
    navigator.clipboard.writeText(shareURL)
    showTempMessage(setShareMsg, "🔗 Link copied!")
  }

  return (
    <>
      <div
        id="control-buttons"
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "12px",
          borderRadius: "8px",
          gap: "8px",
        }}
      >
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          modelList={modelList}
        />
        <ControlButtons
          onScreenshot={() => screenshotCallback.current()}
          onSaveState={saveSceneState}
          onRestoreState={restoreSceneState}
          onShareLink={handleShareLink}
          saveMsg={saveMsg}
          restoreMsg={restoreMsg}
          shareMsg={shareMsg}
        />
      </div>

      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [0, 2, 5], fov: 60 }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <SetBackgroundTexture />
        <ScreenshotHelper onReady={(fn) => (screenshotCallback.current = fn)} />
        <SceneSetup controlsRef={controlsRef} cameraRef={cameraRef} />
        <Model url={`${MODEL_FOLDER}${selectedModel}`} modelRef={modelRef} />
      </Canvas>
    </>
  )
}
