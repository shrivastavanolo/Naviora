"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useDeletePlace } from "@/hooks/use-places";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeletePlaceDialogProps {
  placeId: string;
  tripId: string;
  placeName: string;
}

export function DeletePlaceDialog({
  placeId,
  tripId,
  placeName,
}: DeletePlaceDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeletePlace(tripId);

  function handleDelete() {
    mutate(placeId, {
      onSuccess: () => {
        toast.success("Place deleted successfully!");

        setOpen(false);
      },

      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
        Delete
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Place</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete <strong>{placeName}</strong>?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
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
