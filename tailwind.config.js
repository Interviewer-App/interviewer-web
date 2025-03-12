/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent-color)",
        background: "var(--background-color)",
        "title-card-background": "var(--title-card-background)",
        "features-card-background": "var(--features-card-background)",
        "benefits-card-background": "var(--benefits-card-background)",
        "benefit-card1-background": "var(--benefit-card1-background)",
        "benefit-card2-background": "var(--benefit-card2-background)",
        "benefit-card3-background": "var(--benefit-card3-background)",
        "benefit-card4-background": "var(--benefit-card4-background)",
        "footer-background": "var(--footer-background)",
		"skills-card-background": "var(--skills-card-background)",
        "request-demo-background": "var(--request-demo-background)",
        "request-demo-background-hover": "var(--request-demo-background-hover)",
        "request-demo-text-hover": "var(--request-demo-text-hover)",
        
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        pacifico: ["var(--font-pacifico)", "sans-serif"],
        "bohemian-soul": ["var(--font-bohemian-soul)", "sans-serif"],
        jakarta: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        playfair: ["var(--font-playfair_display)", "serif"],
        kode_mono: ["var(--font-kode_mono)", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
