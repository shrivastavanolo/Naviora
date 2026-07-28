"use client";

import { motion } from "framer-motion";
import { Users, Route, Map, PenTool, Sparkles } from "lucide-react";

const goals = [
  {
    icon: Users,
    title: "Collaborative itinerary planning",
    description:
      "Plan trips together with friends and family in real time.",
  },
  {
    icon: Route,
    title: "Route optimization",
    description:
      "Optimize multi-stop routes to save time and maximize your travel experience.",
  },
  {
    icon: Map,
    title: "Interactive maps",
    description:
      "Visualize your entire trip on an interactive map with detailed place markers.",
  },
  {
    icon: PenTool,
    title: "Real-time editing",
    description:
      "Make changes to your itinerary on the fly with instant sync across all devices.",
  },
  {
    icon: Sparkles,
    title: "AI itinerary suggestions",
    description:
      "Get intelligent recommendations for places, routes, and activities powered by AI.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function GoalsSection() {
  return (
    <section className="flex items-center justify-center border-t border-border/50 px-6 py-28">
      <div className="flex w-full max-w-5xl flex-col items-center gap-12">
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: "easeOut" as const },
            },
          }}
          className="rounded-full border border-border bg-muted px-4 py-1 text-xs font-medium tracking-wider text-primary uppercase"
        >
          Goals
        </motion.span>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {goals.map((goal) => (
            <motion.div
              key={goal.title}
              variants={cardVariants}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <goal.icon className="size-5" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {goal.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {goal.description}
              </p>
            </motion.div>
          ))}

          <div className="hidden lg:block" />
        </motion.div>
      </div>
    </section>
  );
}
