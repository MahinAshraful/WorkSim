import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { createClient } from '@/utils/supabase/server'
import { FlowgladProvider } from '@flowglad/nextjs'
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobSim - Real-World Job Simulations",
  description: "Practice real job skills through interactive simulations",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user }
  } = await (await supabase).auth.getUser()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-grow">
            <FlowgladProvider loadBilling={!!user}>
              {children}
            </FlowgladProvider>
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}