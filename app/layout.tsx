import type { Metadata } from "next";
import { Inter , Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
const inter = Inter({ subsets: ["latin"] });
const spaceGrotask =  Space_Grotesk({ subsets :
   ["latin"],
   weight : ['300', '400' , '500' , '600', '700']
  } )

export const metadata: Metadata = {
  title: "Fair  Price tracker",
  description: "Save up && Find faster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

            <main className="w-max-10x mx-auto">
             < Navbar />
             {children}
            </main>
         
        </body>
    </html>
  );
}
