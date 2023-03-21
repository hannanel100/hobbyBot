import { Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Providers from "./providers";
import Title from "./Title";
import AuthContext from "./AuthContext";
import Navbar from "./Navbar";
import Image from "next/image";
export const metadata = {
  title: "HobbyBot",
  description: "An Ai powered app to find you your next hobby",
};
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--roboto",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.className}`}>
      <head>
        <link rel="icon" href="/icon.png" />
      </head>
      <body className="my-8 bg-teal-50 text-teal-900 dark:bg-teal-900 dark:text-teal-50 md:mx-auto">
        <AuthContext>
          <Navbar />
          <div className="mx-8 max-w-2xl md:mx-auto">
            <Title />
            <Providers>{children}</Providers>
          </div>
          <Analytics />
        </AuthContext>
      </body>
    </html>
  );
}
