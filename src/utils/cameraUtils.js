import * as THREE from "three"

/**
 * Smoothly animates the camera back to its default position
 *
 * @param {React.RefObject} cameraRef - Reference to the Three.js camera
 * @param {React.RefObject} controlsRef - Reference to the OrbitControls
 * @param {Array} defaultPosition - Default camera position [x, y, z]
 * @param {Array} defaultTarget - Default camera target [x, y, z]
 * @param {Number} duration - Animation duration in milliseconds
 */
export function resetCamera(
  cameraRef,
  controlsRef,
  defaultPosition = [0, 2, 5],
  defaultTarget = [0, 0, 0],
  duration = 1000
) {
  if (cameraRef.current && controlsRef.current) {
    // Set the target to the center
    controlsRef.current.target.set(...defaultTarget)

    // Animate the camera position
    const startPosition = cameraRef.current.position.clone()
    const endPosition = new THREE.Vector3(...defaultPosition)

    // Create an animation
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
