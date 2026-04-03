import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "@/components/ClientLayout"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tamilisai-mylapore.in'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Dr. Tamilisai Soundararajan | Mylapore Constituency",
    template: "%s | Dr. Tamilisai Soundararajan",
  },
  description: "Official constituency website of Dr. Tamilisai Soundararajan — Mylapore. Doctor. Public Servant. Here to Listen. Raise local issues, track progress, and connect directly.",
  keywords: [
    "Tamilisai Soundararajan",
    "Dr Tamilisai",
    "Mylapore",
    "Mylapore constituency",
    "BJP Mylapore",
    "Pugaar Petti",
    "complaint box",
    "Chennai constituency",
    "Tamil Nadu politics",
    "Mylapore MLA",
    "public grievance",
    "local issues",
    "Mandaveli",
    "Alwarpet",
    "Raja Annamalai Puram",
    "Royapettah",
  ],
  authors: [{ name: "Dr. Tamilisai Soundararajan" }],
  creator: "Dr. Tamilisai Soundararajan",
  publisher: "Bharatiya Janata Party — Mylapore",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Dr. Tamilisai Soundararajan | Mylapore Constituency",
    description: "From medicine to governance, my work has always been about people. Raise local issues through Pugaar Petti and help build a better Mylapore.",
    url: BASE_URL,
    siteName: "Dr. Tamilisai Soundararajan — Mylapore",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/Dr Tamilisai Soundararajan Main Pic.jpg",
        width: 1200,
        height: 630,
        alt: "Dr. Tamilisai Soundararajan — Mylapore Constituency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Tamilisai Soundararajan | Mylapore",
    description: "Doctor. Public Servant. Here to Listen. Official constituency website — raise issues, track progress, connect directly.",
    site: "@DrTamilisai4BJP",
    creator: "@DrTamilisai4BJP",
    images: ["/Dr Tamilisai Soundararajan Main Pic.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "politics",
  other: {
    // Geo targeting for Mylapore, Chennai
    "geo.region": "IN-TN",
    "geo.placename": "Mylapore, Chennai",
    "geo.position": "13.0339;80.2707",
    "ICBM": "13.0339, 80.2707",
    // Verification placeholders
    "google-site-verification": "",
  },
}

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Dr. Tamilisai Soundararajan — Mylapore",
      description: "Official constituency website of Dr. Tamilisai Soundararajan — Mylapore",
      publisher: { "@id": `${BASE_URL}/#person` },
      inLanguage: ["en", "ta", "hi"],
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Dr. Tamilisai Soundararajan",
      jobTitle: "Member of Legislative Assembly",
      description: "MBBS from Madras Medical College. First woman BJP State President of Tamil Nadu. Former Governor of Telangana & Lt. Governor of Puducherry. Now serving Mylapore constituency.",
      url: BASE_URL,
      sameAs: [
        "https://x.com/DrTamilisai4BJP",
        "https://www.instagram.com/drtamilisai4bjp/",
        "https://facebook.com/DrTamilisai",
        "https://en.wikipedia.org/wiki/Tamilisai_Soundararajan",
      ],
      image: `${BASE_URL}/Dr Tamilisai Soundararajan Main Pic.jpg`,
      affiliation: {
        "@type": "PoliticalParty",
        name: "Bharatiya Janata Party",
      },
      worksFor: {
        "@type": "GovernmentOrganization",
        name: "Tamil Nadu Legislative Assembly",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Chennai",
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        },
      },
    },
    {
      "@type": "GovernmentService",
      name: "Pugaar Petti — Mylapore Complaint Box",
      description: "A public grievance redressal system for Mylapore constituency residents to raise local issues directly.",
      url: `${BASE_URL}/pugaar-petti`,
      provider: { "@id": `${BASE_URL}/#person` },
      areaServed: {
        "@type": "City",
        name: "Mylapore",
        containedInPlace: {
          "@type": "City",
          name: "Chennai",
          containedInPlace: {
            "@type": "State",
            name: "Tamil Nadu",
          },
        },
      },
      serviceType: "Public Grievance Redressal",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
