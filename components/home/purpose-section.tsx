"use client";

import { motion } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function PurposeSection() {
  return (
    <section className="relative flex items-center justify-center border-t border-border/50 px-4 py-16 sm:px-6 sm:py-28 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-fixed bg-center opacity-[0.3]"
        style={{ backgroundImage: "url(/assets/background/bg.png)" }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--accent),transparent_85%),transparent_70%)]" />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={reveal}
        className="flex w-full max-w-3xl flex-col items-center gap-5 text-center"
      >
        <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-medium tracking-wider text-accent uppercase">
          Purpose
        </span>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:text-xl">
          Naviora helps users collaboratively plan trips, optimize multi-stop
          itineraries, and manage travel in real time.
        </p>
      </motion.div>
    </section>
  );
}
