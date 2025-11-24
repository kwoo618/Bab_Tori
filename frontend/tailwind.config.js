/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        primary: "rgb(249 115 22)",
        secondary: "rgb(168 85 247)",
        accent: "rgb(251 146 60)",
        card: "rgb(255 255 255)",
        muted: "rgb(241 241 239)",
        "muted-foreground": "rgb(127 127 125)",
      },
      borderRadius: {
        ...defaultConfig.theme.extend.borderRadius,
        lg: "1.5rem",
        md: "1rem",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("@tailwindcss/forms"), require("tailwindcss-animate")],
}
