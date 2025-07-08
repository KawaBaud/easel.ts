import type { UserConfig } from "vite";

// https://vitejs.dev/config/
// biome-ignore lint/style/noDefaultExport: vite needs default
export default {
	build: {
		lib: {
			entry: "src/index.ts",
			fileName: (format, entryName) => `${entryName}.${format}.js`,
			name: "easel",
		},
	},
} satisfies UserConfig;
