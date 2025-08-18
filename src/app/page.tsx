"use client"
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();

  const checking = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://mediabackend-yj45.onrender.com/api/currentUser`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setTimeout(() => {
          route.replace("/users");
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setTimeout(() => {
        route.replace("/login");
      }, 1000);
    }
  }, [route]);

  useEffect(() => {
    checking();
  }, [checking]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }, // delay between letters
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const text = "Welcome to Real Media";

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-2xl font-bold"
      >
        {text.split("").map((char, i) => (
          <motion.span key={i} variants={letter}
          className={`text-sm sm:text-lg text-[#1B4543] font-serif font-bold`}
          style={{textShadow:`2px 2px 2px black`}}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
