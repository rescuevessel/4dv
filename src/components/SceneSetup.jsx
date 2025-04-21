import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

// This component handles the Three.js background
export function SetBackground({ type, color, gradientColors }) {
  const { scene } = useThree()

  useEffect(() => {
    if (type === "texture") {
      const loader = new THREE.TextureLoader()
      loader.load("/gradient.jpg", (texture) => {
        scene.background = texture
      })
    } else if (type === "gradient") {
      // Create a gradient texture
      const canvas = document.createElement("canvas")
      canvas.width = 2
      canvas.height = 512 // Height determines gradient smoothness
      const context = canvas.getContext("2d")

      // Create gradient
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, gradientColors.top)
      gradient.addColorStop(1, gradientColors.bottom)

      // Fill canvas with gradient
      context.fillStyle = gradient
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Create and set the texture
      const texture = new THREE.CanvasTexture(
        canvas,
        THREE.UVMapping,
        THREE.ClampToEdgeWrapping,
        THREE.ClampToEdgeWrapping,
        THREE.LinearFilter,
        THREE.LinearFilter
      )
      scene.background = texture
    } else {
      scene.background = new THREE.Color(color)
    }
  }, [scene, type, color, gradientColors])

  //scene.fog = new THREE.Fog(0x000000, 1, 10)

  return null
}

export default function SceneSetup({ controlsRef, cameraRef }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls ref={controlsRef} />
    </>
  )
}
