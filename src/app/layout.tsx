import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incident Reliability Platform",
  description:
    "Monitor incidents, investigate failures, and track system reliability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}