import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "@/components/ClientLayout"

export const metadata: Metadata = {
  title: "Dr. Tamilisai Soundararajan | Mylapore Constituency",
  description: "Doctor. Public Servant. Here to Listen. Official constituency website of Dr. Tamilisai Soundararajan — Mylapore.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Dr. Tamilisai Soundararajan | Mylapore",
    description: "From medicine to governance, my work has always been about people.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
