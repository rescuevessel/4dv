import { useEffect, useState } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

export default function Model({ url, modelRef, color, showEdges = false }) {
  const { scene } = useGLTF(url)
  const [edgeLines, setEdgeLines] = useState([])

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Create a new material if it doesn't exist
        if (!child.material.originalColor) {
          child.material = child.material.clone()
          child.material.originalColor = child.material.color.clone()
        }
        // Apply the new color or restore original color
        if (color) {
          child.material.color.set(color)
        } else {
          child.material.color.copy(child.material.originalColor)
        }
      }
    })
  }, [scene, color])

  useEffect(() => {
    // Clean up previous edge lines
    edgeLines.forEach((line) => {
      scene.remove(line)
      line.geometry.dispose()
      line.material.dispose()
    })
    setEdgeLines([])

    if (showEdges) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Create edges geometry
          const edges = new THREE.EdgesGeometry(child.geometry)
          // Create line segments with a basic black material
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
          )
          // Copy the mesh's transformation
          line.matrix = child.matrix
          line.matrixAutoUpdate = false
          // Add to scene
          scene.add(line)
          // Store for cleanup
          setEdgeLines((prev) => [...prev, line])
        }
      })
    }
  }, [scene, showEdges])

  return <primitive ref={modelRef} object={scene} />
}
