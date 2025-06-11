// Custom layout for the admin login page to avoid sidebar/header
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100`}>
      {children}
    </div>
  );
}
