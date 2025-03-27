import { useThree } from "@react-three/fiber"

export default function ScreenshotHelper({ onReady }) {
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
