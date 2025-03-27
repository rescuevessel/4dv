import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import fs from "fs"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    middleware: [
      {
        name: "list-models",
        configureServer(server) {
          server.middlewares.use("/api/models", (req, res) => {
            const modelsDir = path.join(process.cwd(), "public/models")
            try {
              const files = fs
                .readdirSync(modelsDir)
                .filter((file) => file.endsWith(".glb")) // Only get .glb files
              res.setHeader("Content-Type", "application/json")
              res.end(JSON.stringify(files))
            } catch (error) {
              console.error("Error reading models directory:", error)
              res.statusCode = 500
              res.end(
                JSON.stringify({ error: "Failed to read models directory" })
              )
            }
          })
        },
      },
    ],
  },
})
