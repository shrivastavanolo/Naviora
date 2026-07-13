"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createPlaceSchema,
  type CreatePlaceInput,
  CreatePlaceForm,
} from "@/src/schemas/place";

import { useCreatePlace } from "@/hooks/use-places";

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

interface CreatePlaceDialogProps {
  tripId: string;
}

export function CreatePlaceDialog({ tripId }: CreatePlaceDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreatePlace(tripId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaceForm>({
    resolver: zodResolver(createPlaceSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      notes: "",
      estimatedDuration: undefined,
    },
  });

  function onSubmit(values: CreatePlaceInput) {
    mutate(values, {
      onSuccess: () => {
        toast.success("Place added successfully!");

        reset();
        setOpen(false);
      },

      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
        + Add Place
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Place</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>

            <Input placeholder="Tokyo Tower" {...register("name")} />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Address</Label>

            <Input placeholder="Minato City, Tokyo" {...register("address")} />

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
            <Label>Estimated Duration (minutes)</Label>

            <Input
              type="number"
              {...register("estimatedDuration", {
                valueAsNumber: true,
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

            <Textarea
              placeholder="Best visited during sunset..."
              {...register("notes")}
            />

            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Place"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
