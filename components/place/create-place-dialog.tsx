"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createPlaceSchema,
  type CreatePlaceInput,
  type CreatePlaceForm,
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

import { PlaceSearch } from "./place-search";

interface Props {
  tripId: string;
  dayId?: string;
}

export function CreatePlaceDialog({ tripId, dayId }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreatePlace(tripId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePlaceForm>({
    resolver: zodResolver(createPlaceSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      notes: "",
      estimatedDuration: undefined,
    },
  });

  function onSubmit(values: CreatePlaceInput) {
    mutate({ ...values, dayId } as CreatePlaceInput & { dayId?: string }, {
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
      <DialogTrigger>+ Add Place</DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Place</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-5">
          <div className="space-y-2">
            <Label>Search Place</Label>

            <PlaceSearch
              onSelect={(place) => {
                setValue("name", place.name);
                setValue("address", place.address);
                setValue("latitude", place.latitude);
                setValue("longitude", place.longitude);
              }}
            />
          </div>

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

          <Input
            type="hidden"
            {...register("latitude", {
              valueAsNumber: true,
            })}
          />
          <Input
            type="hidden"
            {...register("longitude", {
              valueAsNumber: true,
            })}
          />

          <div className="space-y-2">
            <Label>Notes</Label>

            <Textarea {...register("notes")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estimated Duration (minutes)</Label>

              <Input
                type="number"
                {...register("estimatedDuration", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Place"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
