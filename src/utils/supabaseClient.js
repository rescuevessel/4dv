import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const listModels = async () => {
  const { data, error } = await supabase.storage.from("models").list("", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  })

  if (error) {
    console.error("Error fetching files:", error)
    return []
  }

  return data
}

export const getDatabaseModels = async () => {
  const { data, error } = await supabase.from("models").select("*")
  if (error) {
    console.error("Error fetching models:", error)
    return []
  }
  return data
}

export const uploadModel = async (file, name) => {
  try {
    // 1. Upload the file to storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${name}.${fileExt}`
    const { data: storageData, error: storageError } = await supabase.storage
      .from("models")
      .upload(fileName, file)

    if (storageError) {
      throw storageError
    }

    // 2. Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("models").getPublicUrl(fileName)

    // 3. Create a record in the database
    const { error: dbError } = await supabase.from("models").insert([
      {
        name: name,
        url: publicUrl,
        created_at: new Date().toISOString(),
      },
    ])

    if (dbError) {
      throw dbError
    }

    return { success: true }
  } catch (error) {
    console.error("Error uploading model:", error)
    return { success: false, error }
  }
}

export const deleteModel = async (modelUrl) => {
  try {
    // Extract the file name from the URL
    const fileName = modelUrl.split("/").pop()

    // 1. Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from("models")
      .remove([fileName])

    if (storageError) {
      throw storageError
    }

    // 2. Delete the record from the database
    const { error: dbError } = await supabase
      .from("models")
      .delete()
      .eq("url", modelUrl)

    if (dbError) {
      throw dbError
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting model:", error)
    return { success: false, error }
  }
}

export const renameModel = async (modelUrl, newName) => {
  try {
    console.log("Attempting to rename model:", { modelUrl, newName })

    const { data, error } = await supabase
      .from("models")
      .update({ name: newName })
      .eq("url", modelUrl)
      .select()

    console.log("Rename response:", { data, error })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error renaming model:", error)
    return { success: false, error }
  }
}
