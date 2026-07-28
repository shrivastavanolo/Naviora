"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useDeleteTrip } from "@/hooks/use-trips";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  tripId: string;
  title: string;
}

export function DeleteTripDialog({ tripId, title }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteTrip();

  function handleDelete() {
    mutate(tripId, {
      onSuccess() {
        toast.success("Trip deleted");
        setOpen(false);
      },

      onError(error) {
        toast.error(error.message);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="xs" />}>Delete</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Trip</DialogTitle>

          <DialogDescription>
            Delete <strong>{title}</strong>?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
