"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  updateTripSchema,
  type UpdateTripInput,
  type UpdateTripFormValues,
} from "@/src/schemas/trip";

import { useUpdateTrip } from "@/hooks/use-trips";

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

interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: string | Date | null;
  endDate: string | Date | null;
}

interface Props {
  trip: Trip;
}

function formatDate(date: string | Date | null) {
  if (!date) return undefined;

  return new Date(date).toISOString().split("T")[0];
}

export function EditTripDialog({ trip }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useUpdateTrip();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTripFormValues>({
    resolver: zodResolver(updateTripSchema),

    defaultValues: {
      title: trip.title,
      description: trip.description ?? "",
      startDate: formatDate(trip.startDate),
      endDate: formatDate(trip.endDate),
    },
  });

  const onSubmit: SubmitHandler<UpdateTripInput> = (values) => {
    mutate(
      {
        tripId: trip.id,
        data: values,
      },
      {
        onSuccess: () => {
          toast.success("Trip updated successfully!");
          setOpen(false);
        },

        onError: (error: Error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Edit</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>

            <Input id="title" placeholder="Japan 2027" {...register("title")} />

            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="Cherry blossom trip..."
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>

              <Input id="startDate" type="date" {...register("startDate")} />

              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>

              <Input id="endDate" type="date" {...register("endDate")} />

              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
