module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards", // Fade in animation
        "fade-out": "fadeOut 0.5s ease-in forwards", // Fade out animation
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1", // Full opacity (visible)
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1", // Fully visible at start
          },
          "100%": {
            opacity: "0", // Fade out to invisible
          },
        },
      },
    },
  },
  plugins: [],
};
