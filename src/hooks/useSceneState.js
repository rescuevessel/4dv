import { useState, useEffect } from "react"
import {
  getSceneStateFromURL,
  generateShareableLink,
  showTempMessage,
} from "../utils/sceneState"

export default function useSceneState(
  modelRef,
  controlsRef,
  cameraRef,
  modelList
) {
  const [selectedModel, setSelectedModel] = useState(modelList[0])
  const [savedState, setSavedState] = useState(null)
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

  return {
    selectedModel,
    setSelectedModel,
    saveMsg,
    restoreMsg,
    shareMsg,
    saveSceneState,
    restoreSceneState,
    handleShareLink,
  }
}
