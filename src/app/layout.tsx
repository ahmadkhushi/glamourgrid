import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "GlamourGrid",
  description: "Luxury Cosmetics and Fragrances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}