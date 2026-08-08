"use client";
import { motion } from "framer-motion";
export default function StorefrontTemplate({ children }: { children: React.ReactNode }) {
  return <motion.div className="flex min-h-0 flex-1 flex-col" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28, ease: "easeOut" }}>{children}</motion.div>;
}
