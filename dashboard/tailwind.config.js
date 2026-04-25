/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#06b6d4",
        secondary: "#8b5cf6",
        accent: "#f43f5e",
        success: "#10b981",
        warning: "#f59e0b",
        surface: "#0f172a",
        background: "#020617",
      },
      textColor: {
        "text-main": "#f1f5f9",
        "text-dim": "#94a3b8",
        "text-muted": "#64748b",
      },
      gridTemplateColumns: {
        '20': 'repeat(20, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}

