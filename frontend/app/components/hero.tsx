"use client";

import { useScanner } from "../hooks/user";
import { motion, AnimatePresence } from "framer-motion";
import { UserStatus } from "@/types/user";

export default function HeroScanner({ isLoggedIn }: UserStatus) {
  const {
    isLoading,
    errorMsg,
    fileInputRef,
    handleScanClick,
    handleFileChange,
  } = useScanner(isLoggedIn);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 w-full relative z-0 -mt-16 sm:-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
          Verifikasi Instan <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FAA916] to-white">
            Plat Kendaraan!
          </span>
        </h1>

        <p className="text-zinc-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
          Ambil foto plat nomor atau ketik manual untuk validasi data kendaraan
          secara akurat menggunakan AI.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center"
      >
        <button className="group flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FAA916] transition-all font-semibold text-white">
          <span className="text-xl group-hover:scale-110 transition-transform">
            ⌨️
          </span>
          Ketik Manual
        </button>

        <button
          onClick={handleScanClick}
          disabled={isLoading}
          className="relative group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-linear-to-br from-orange-500 to-[#FAA916] hover:bg-amber-50 transition-all font-semibold text-white shadow-lg cursor-pointer"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <span className="text-xl group-hover:rotate-12 transition-transform">
              📸
            </span>
          )}
          <span>{isLoading ? "Memproses..." : "Scan Foto"}</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </motion.div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 px-4 py-2 rounded-lg border text-sm ${
              errorMsg.includes("login")
                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
