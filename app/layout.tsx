import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Title from "./Title";
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
      <body className="mx-8 mt-8 max-w-md bg-teal-50 text-teal-900 dark:bg-teal-900 dark:text-teal-50 md:mx-auto">
        <Title />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
