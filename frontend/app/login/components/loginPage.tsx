"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
} from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/auth";
import { GoogleLogin } from "@/lib/action";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-[#FDBD4E] to-[#F2F2F2] p-4 font-sans z-[999] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Added 'my-auto' untuk jaga-jaga di layar pendek
        className="w-full max-w-md bg-[#F2F2F2] rounded-[2.5rem] overflow-hidden shadow-2xl relative my-auto"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-b from-[#FDBD4E] to-[#F2F2F2] pt-8 pb-4 px-6 relative">
          <button className="absolute top-8 left-6 bg-orange-400/20 hover:bg-orange-400/40 text-white p-2 rounded-full transition">
            <FaChevronLeft size={20} />
          </button>

          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="p-3 rounded-2xl text-white"
            >
              <BiLogIn size={34} />
            </motion.div>
          </div>

          <h1 className="text-center text-xl font-semibold text-gray-800 mb-6">
            Silahkan Melakukan Log In
          </h1>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-10">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                <FaUser size={18} />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#F5F5F5] border border-gray-400 text-gray-800 text-sm rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                <FaLock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-[#F5F5F5] border border-gray-400 text-gray-800 text-sm rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4"
            >
              Login
            </motion.button>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">
              atau Login Menggunakan
            </span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <form action={GoogleLogin}>
            <motion.button
              whileHover={{ backgroundColor: "#f9fafb" }}
              className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl shadow-sm flex items-center justify-center gap-3"
            >
              <FcGoogle size={24} />
              Google
            </motion.button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-8">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-orange-500 font-bold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
