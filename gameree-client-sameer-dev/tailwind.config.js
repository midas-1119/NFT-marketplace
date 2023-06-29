module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#A0AAC1",
        blue1: "#6478E2",
        purples: " #8264E2",
        black1: "#070E1E",
        black2: "#535353",
        lightgray: "#E6E4E2",
        grays: "#CACACA",
        gray1: "#777E9",
        gray2: "#B0B7C9",
      },
      fontFamily: {
        EdoSZ: "EdoSZ",
        "Montserrat-Bold": "Montserrat-Bold",
        "Montserrat-SemiBold": "Montserrat-SemiBold",
        "Montserrat-Medium": "Montserrat-Medium",
        "Montserrat-Regular": "Montserrat-Regular",
        "TTTrailers-Bold": "TTTrailers-Bold",
        "TTTrailers-SemiBold": "TTTrailers-SemiBold",
        "TTTrailers-Medium": "TTTrailers-Medium",
        "TTTrailers-Regular": "TTTrailers-Regular",
      },
      screens: {
        xs: { min: "300px", max: "530px" },
        xs1: { min: "300px", max: "400px" },
      },
      lineHeight: {
        0: "0",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
