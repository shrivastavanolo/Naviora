"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteAccount } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { mutate, isPending } = useDeleteAccount();

  const handleDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        toast.success("Account deleted");
        router.push("/");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete Account
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will permanently delete your account and all associated trips
            and data. This action cannot be undone.
          </p>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              Type <span className="font-semibold text-destructive">DELETE</span> to confirm
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>

          <Button
            variant="destructive"
            className="w-full"
            disabled={confirmText !== "DELETE" || isPending}
            onClick={handleDelete}
          >
            {isPending ? "Deleting..." : "Permanently Delete My Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
