/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // update this depending on your project
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4ECDC4",
          secondary: "#292F36",
          background: "#F7FFF7",
        },
      },
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: [
        {
          mytheme: {
            primary: "#4ECDC4",
            secondary: "#292F36",
            accent: "#37cdbe",     // optional, you can customize this too
            neutral: "#3d4451",    // optional
            "base-100": "#F7FFF7", // your custom background
          },
        },
      ],
    },
  }
  