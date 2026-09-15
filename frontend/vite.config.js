import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: "automatic", // Prevents "React is not defined" error when using JSX
        }),
    ],
});
