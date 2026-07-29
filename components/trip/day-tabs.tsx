"use client";

import { Plus } from "lucide-react";
import type { TripDay } from "@/src/types/trip-day";

interface DayTabsProps {
  days: TripDay[];
  activeDayId: string | null;
  onDayChange: (dayId: string) => void;
  onAddDay: () => void;
  isAdding: boolean;
}

export default function DayTabs({
  days,
  activeDayId,
  onDayChange,
  onAddDay,
  isAdding,
}: DayTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b pb-px">
      {days.map((day) => (
        <button
          key={day.id}
          onClick={() => onDayChange(day.id)}
          className={`shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeDayId === day.id
              ? "border-b-2 border-[#6D5EF5] text-[#6D5EF5]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {day.title ?? `Day ${day.dayNumber}`}
        </button>
      ))}
      <button
        onClick={onAddDay}
        disabled={isAdding}
        className="flex shrink-0 items-center gap-1 rounded-t-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        <Plus className="size-4" />
        Add Day
      </button>
    </div>
  );
}
