"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HomeActions } from "./home-actions";
import DomeGallery from "@/components/gallery/dome-gallery";
import Image from "next/image";

export function HeroSection() {
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <DomeGallery />
      </div>

      <div className="absolute inset-0 z-1 bg-background/70 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          className="bg-linear-to-r from-primary to-secondary bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl"
        >
          <Image src="/assets/brand/logo.svg" alt="Naviora" />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
          className="max-w-lg text-lg text-muted-foreground sm:text-xl"
        >
          Plan and optimize your trips with interactive maps.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" as const }}
        >
          <HomeActions />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        >
          <ChevronDown className="size-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
