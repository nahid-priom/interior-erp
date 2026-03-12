import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interior ERP Demo",
  description: "Interior Design ERP demo for Bangladesh-based studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <main className="">{children}</main>
      </body>
    </html>
  );
}

