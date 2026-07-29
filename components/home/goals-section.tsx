"use client";

import { motion } from "framer-motion";
import { Users, Route, Map, PenTool, Sparkles, Target, ShieldCheck } from "lucide-react";
import CardSwap, { Card } from "@/components/home/card-swap";

const features = [
  {
    icon: Users,
    title: "Collaborative planning",
    description:
      "Invite friends and family to co-create itineraries in real time. Everyone can add places, vote, and contribute.",
  },
  {
    icon: Route,
    title: "Route optimization",
    description:
      "Automatically order your stops for the most efficient route. Save time and see more on every trip.",
  },
  {
    icon: Map,
    title: "Interactive maps",
    description:
      "Visualize every place on a shared map with rich details, day-by-day breakdowns, and drag-to-reorder.",
  },
  {
    icon: PenTool,
    title: "Real-time sync",
    description:
      "Changes sync instantly across all devices. No more sharing spreadsheets or screenshotting itineraries.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    description:
      "Trips are invite-only. Your plans stay between you and the people you choose to share with.",
  },
  {
    icon: Sparkles,
    title: "AI itinerary suggestions",
    description:
      "Get smart recommendations for places and activities. AI features are part of the Pro plan and currently in development.",
  },
];

export function GoalsSection() {
  return (
    <section className="flex items-center justify-center border-t border-border/50 px-6 py-28">
      <div className="flex w-full max-w-5xl flex-col items-center gap-16 lg:flex-row">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="flex-1 space-y-6"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="inline-block rounded-full border border-border bg-muted px-4 py-1 text-xs font-medium tracking-wider text-primary uppercase"
          >
            Features
          </motion.span>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
            }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Plan together, travel smarter
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
            }}
            className="text-base leading-relaxed text-muted-foreground"
          >
            Naviora is a collaborative trip planner that lets you build, organize, and optimize
            itineraries with your travel companions in real time. From day-by-day schedules to
            interactive maps, everything stays in sync — no more messy spreadsheets or group chat
            chaos.
          </motion.p>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
            }}
            className="text-sm leading-relaxed text-muted-foreground"
          >
            <Target className="mr-1 inline size-4 text-primary" />
            <span className="font-medium text-foreground">Pro</span> — AI-powered itinerary
            suggestions and advanced route optimization. Currently in active development and rolling
            out soon.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex-1"
          style={{ height: 500 }}
        >
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={4500}
            pauseOnHover
            easing="elastic"
          >
            {features.map((f) => (
              <Card key={f.title}>
                <div className="card-icon">{<f.icon />}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </Card>
            ))}
          </CardSwap>
        </motion.div>
      </div>
    </section>
  );
}
