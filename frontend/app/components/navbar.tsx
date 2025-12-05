"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full flex justify-center pt-6 z-50 pointer-events-none"
    >
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-6 py-2 flex items-center gap-6 text-sm font-medium pointer-events-auto shadow-2xl shadow-black/20">
        <Link
          href="/"
          className="text-gray-300 hover:text-orange-400 transition-colors"
        >
          Beranda
        </Link>
        <Link
          href="/history"
          className="text-gray-300 hover:text-orange-400 transition-colors"
        >
          Riwayat
        </Link>
        <button className="bg-orange-500 hover:bg-orange-600 text-white pl-3 pr-4 py-1.5 rounded-full flex items-center gap-2 transition-colors">
          <span className="text-lg">👤</span>
          Login
        </button>
      </div>
    </motion.nav>
  );
}
