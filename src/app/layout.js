import { AuthProvider } from "@/context/AuthContext";
import localfont from "next/font/local";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Suspense } from "react";
import Loading from "./loading";
import { Plus_Jakarta_Sans, Pacifico, Playfair_Display, Kode_Mono } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-playfair_display",
});

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kode_mono",
});

const bohemianSoul = localfont({
  src: [
    {
      path: "../../public/fonts/Bohemian-Soul.otf",
      weight: "700",
    },
  ],
  variable: "--font-bohemian-soul",
});

export const metadata = {
  title: "Skillchecker",
  description: "Skills Checked. Risks Eliminated. Possibilities Unlocked.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${bohemianSoul.variable} ${pacifico.variable} ${playfairDisplay.variable} ${kodeMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />

        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Oswald&family=Pacifico&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Oswald&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&family=Montserrat:wght@500&family=Oswald&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
