import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pugaar Petti — Raise Local Issues",
  description: "Raise and track local issues in Mylapore constituency. Submit complaints about roads, water, sanitation, electricity, and safety. Your voice matters.",
  openGraph: {
    title: "Pugaar Petti — Mylapore Complaint Box",
    description: "A public grievance redressal system for Mylapore residents. Raise issues, add photos, get community support, and track resolution.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pugaar Petti — Raise Local Issues in Mylapore",
    description: "Submit complaints about local issues in Mylapore. Roads, water, sanitation, electricity, safety — your voice matters.",
  },
}

export default function PugaarPettiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
