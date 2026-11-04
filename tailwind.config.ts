import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          magenta: "#890149",
          "magenta-dark": "#6B0139",
          "magenta-light": "#A81D63",
          ivory: "#F3F3E7",
          "ivory-light": "#FAF9F2",
          "ivory-dark": "#E6E6D8",
          espresso: "#24121B",
          charcoal: "#1A1A1A",
          muted: "#6B6562",
          surface: "#FBFBF7",
          border: "rgba(36, 18, 27, 0.12)",
          "border-dark": "rgba(243, 243, 231, 0.18)",
        },
      },
      fontFamily: {
        display: ["var(--font-cubao)", "sans-serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.15em",
        editorial: "0.2em",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        subtle: "0 4px 20px -2px rgba(36, 18, 27, 0.05)",
        card: "0 10px 30px -4px rgba(36, 18, 27, 0.08)",
        lifted: "0 20px 40px -8px rgba(137, 1, 73, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;

