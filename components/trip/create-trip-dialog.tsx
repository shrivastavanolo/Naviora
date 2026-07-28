"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { Trip } from "@/src/types/trip";

import {
  createTripSchema,
  type CreateTripFormValues,
  type CreateTripInput,
} from "@/src/schemas/trip";

import { useCreateTrip } from "@/hooks/use-trips";

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

export function CreateTripDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreateTrip();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTripFormValues, undefined, CreateTripInput>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit: SubmitHandler<CreateTripInput> = (values) => {
    mutate(values, {
      onSuccess: (trip: Trip) => {
        toast.success("Trip created successfully!");

        reset();
        setOpen(false);
        router.push(`/trips/${trip.id}`);
      },

      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ New Trip</DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Trip</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            {isPending ? "Creating..." : "Create Trip"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
