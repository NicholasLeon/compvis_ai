"use client";

import { motion, AnimatePresence } from "framer-motion";
import z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Logout } from "../../lib/action";
import { BiLogOut, BiErrorCircle } from "react-icons/bi";
import { UserPropsSchema } from "../../types/user";

export default function navbar({ user }: z.infer<typeof UserPropsSchema>) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      {/* --- NAVBAR UTAMA --- */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full flex justify-center pt-6 z-40 pointer-events-none"
      >
        <div className="bg-[#F5F5F540] backdrop-blur-lg border border-white/10 rounded-full px-6 py-2 flex items-center gap-6 text-sm font-medium pointer-events-auto shadow-2xl shadow-black/20">
          <Link
            href="/"
            className="text-gray-300 hover:text-#FAA916 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/history"
            className="text-gray-300 hover:text-#FAA916 transition-colors"
          >
            History
          </Link>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="flex items-center gap-2">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-6 h-6 rounded-full border border-orange-400/50"
                  />
                )}
                <span className="text-gray-200 hidden sm:block">
                  Halo, {user.name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-full transition-colors flex items-center justify-center"
                title="Keluar"
              >
                <BiLogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[#FAA916] hover:bg-[#ffdfa3] text-white pl-3 pr-4 py-1.5 rounded-full flex items-center gap-2 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </motion.nav>

      {/* --- MODAL KONFIRMASI LOGOUT --- */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Gelap */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Kotak Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 text-red-500 p-3 rounded-full mb-4">
                  <BiErrorCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Yakin Keluarkan Akun?
                </h3>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  Akun anda akan keluar dan harus melakukan login kembali.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>

                  {/* Tombol ini yang trigger Server Action */}
                  <button
                    onClick={() => {
                      Logout();
                      setShowLogoutConfirm(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-200 transition"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
