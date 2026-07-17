import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";

export const metadata: Metadata = {
  title: "Campus Companion – Student Support & Welfare Management",
  description:
    "A comprehensive student support, campus safety, and welfare management system for educational institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="page-wrapper">
          {children}
        </div>
        <BootstrapClient />
      </body>
    </html>
  );
}
