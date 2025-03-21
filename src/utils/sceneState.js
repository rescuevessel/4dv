export const parseVector = (str) => str?.split(",").map(Number)

export const getSceneStateFromURL = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    modelParam: params.get("model"),
    modelPos: parseVector(params.get("modelPos")),
    modelRot: parseVector(params.get("modelRot")),
    camPos: parseVector(params.get("camPos")),
    target: parseVector(params.get("target")),
  }
}

export const generateShareableLink = (state) => {
  const params = new URLSearchParams({
    model: state.model,
    modelPos: state.modelPos.join(","),
    modelRot: state.modelRot.join(","),
    camPos: state.camPos.join(","),
    target: state.target.join(","),
  })
  return `${window.location.origin}${
    window.location.pathname
  }?${params.toString()}`
}

export const showTempMessage = (setter, message) => {
  setter(message)
  setTimeout(() => setter(""), 1000)
}
