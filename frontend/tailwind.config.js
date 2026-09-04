/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F1ECDD",
        ink: "#1F2A22",
        pine: "#28422F",
        pineDark: "#1B2E20",
        amber: "#C08A2E",
        rust: "#A34A28",
        card: "#FBF7EC",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "2px 2px 0 0 #1F2A22",
      },
    },
  },
  plugins: [],
};
