module.exports = {
  mode: "jit",
  purge: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        body: ["CircularStd", "Open Sans", "system-ui", "sans-serif !important"],
        heading: ["CircularStd", "Open Sans", "system-ui", "sans-serif !important"],
      },
      colors: {
        white: "#ffffff",
        black: "#000000",
        primary: "var(--gossamer-500)",
        "primary-2": "var(--gossamer-600)",

        gossamer: {
          50: "var(--gossamer-50)",
          100: "var(--gossamer-100)",
          200: "var(--gossamer-200)",
          300: "var(--gossamer-300)",
          400: "var(--gossamer-400)",
          500: "var(--gossamer-500)",
          600: "var(--gossamer-600)",
          700: "var(--gossamer-700)",
          800: "var(--gossamer-800)",
          900: "var(--gossamer-900)",
        },
      },

      textColor: {
        body: "#6B7280",
        heading: "#1F2937",
      },

      height: {
        13: "3.125rem",
        double: "200%",
      },
      maxWidth: {
        5: "1.25rem",
      },
      maxHeight: {
        5: "1.25rem",
      },
      spacing: {
        22: "5.5rem",
      },

      borderRadius: {
        DEFAULT: "5px",
      },

      boxShadow: {
        base: "rgba(0, 0, 0, 0.16) 0px 4px 16px",
      },
      gridTemplateColumns: {
        fit: "repeat(auto-fit, minmax(0, 1fr))",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["even", "odd"],
      borderWidth: ["last", "focus"],
      margin: ["last", "first"],
      padding: ["last", "first"],
    },
  },
  plugins: [],
};
