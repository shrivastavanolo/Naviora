"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updatePlaceSchema, type UpdatePlaceInput } from "@/src/schemas/place";

import { useUpdatePlace } from "@/hooks/use-places";
import { useDays } from "@/hooks/use-trip-days";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Place = {
  id: string;
  tripId: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
  estimatedDuration: number | null;
  dayId: string | null;
};

interface EditPlaceDialogProps {
  place: Place;
}

export function EditPlaceDialog({ place }: EditPlaceDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useUpdatePlace(place.tripId);
  const { data: days } = useDays(place.tripId);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(place.dayId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePlaceInput>({
    resolver: zodResolver(updatePlaceSchema),
    defaultValues: {
      name: place.name,
      address: place.address ?? "",
      latitude: place.latitude,
      longitude: place.longitude,
      notes: place.notes ?? "",
      estimatedDuration: place.estimatedDuration ?? undefined,
    },
  });

  function onSubmit(values: UpdatePlaceInput) {
    mutate(
      {
        placeId: place.id,
        data: { ...values, dayId: selectedDayId },
      },
      {
        onSuccess: () => {
          toast.success("Place updated successfully!");
          setOpen(false);
        },

        onError: (error: Error) => {
          toast.error(error.message);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-md border px-3 py-2 text-sm hover:bg-accent">
        Edit
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Place</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>

            <Input {...register("name")} />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Address</Label>

            <Input {...register("address")} />

            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latitude</Label>

              <Input
                type="number"
                step="any"
                {...register("latitude", {
                  valueAsNumber: true,
                })}
              />

              {errors.latitude && (
                <p className="text-sm text-red-500">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>

              <Input
                type="number"
                step="any"
                {...register("longitude", {
                  valueAsNumber: true,
                })}
              />

              {errors.longitude && (
                <p className="text-sm text-red-500">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Move to Day</Label>
            <select
              value={selectedDayId ?? ""}
              onChange={(e) => setSelectedDayId(e.target.value || null)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">No day</option>
              {days?.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.title ?? `Day ${day.dayNumber}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Estimated Duration (minutes)</Label>

            <Input
              type="number"
              {...register("estimatedDuration", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />

            {errors.estimatedDuration && (
              <p className="text-sm text-red-500">
                {errors.estimatedDuration.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>

            <Textarea {...register("notes")} />

            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
