"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import type { Place } from "@/src/types/place";
import { EditPlaceDialog } from "@/components/place/edit-place-dialog";
import { DeletePlaceDialog } from "@/components/place/delete-place-dialog";

function SortablePlaceCard({
  place,
  isStart,
  isEnd,
}: {
  place: Place;
  isStart: boolean;
  isEnd: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border p-4 ${
        isDragging ? "z-10 opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-5" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{place.name}</h3>
          {isStart && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
              Start
            </span>
          )}
          {isEnd && (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
              End
            </span>
          )}
        </div>

        {place.address && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {place.address}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <EditPlaceDialog place={place} />
        <DeletePlaceDialog
          placeId={place.id}
          tripId={place.tripId}
          placeName={place.name}
        />
      </div>
    </div>
  );
}

interface DayPanelProps {
  places: Place[];
  onReorder: (orders: { id: string; visitOrder: number }[]) => void;
}

export default function DayPanel({ places, onReorder }: DayPanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = places.findIndex((p) => p.id === active.id);
      const newIndex = places.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...places];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const orders = reordered.map((p, i) => ({
        id: p.id,
        visitOrder: i + 1,
      }));

      onReorder(orders);
    },
    [places, onReorder]
  );

  if (!places.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No places on this day yet.
      </div>
    );
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={places.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {places.map((place, index) => (
              <SortablePlaceCard
                key={place.id}
                place={place}
                isStart={index === 0}
                isEnd={index === places.length - 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
