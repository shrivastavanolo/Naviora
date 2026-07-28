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
    <section className="flex items-center justify-center border-t border-border/50 px-6 py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={reveal}
        className="flex w-full max-w-3xl flex-col items-center gap-5 text-center"
      >
        <span className="rounded-full border border-border bg-muted px-4 py-1 text-xs font-medium tracking-wider text-primary uppercase">
          Purpose
        </span>
        <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Naviora helps users collaboratively plan trips, optimize multi-stop
          itineraries, and manage travel in real time.
        </p>
      </motion.div>
    </section>
  );
}
