import React from "react"
import { useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

export function SetBackgroundTexture() {
  const { scene } = useThree()
  React.useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load("/gradient.jpg", (texture) => {
      scene.background = texture
    })
  }, [scene])
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
