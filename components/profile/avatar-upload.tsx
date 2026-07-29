"use client";

import { UploadButton } from "@/lib/uploadthing";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface AvatarUploadProps {
  avatar: string | null;
  name: string;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ avatar, name, onUploadComplete }: AvatarUploadProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Avatar size="lg" className="size-24">
        {avatar ? (
          <AvatarImage src={avatar} alt={name} />
        ) : null}
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <UploadButton
          endpoint="avatarUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              onUploadComplete(res[0].url);
              toast.success("Profile picture updated!");
            }
          }}
          onUploadError={(error: Error) => {
            toast.error(error.message);
          }}
        />
        <p className="text-xs text-muted-foreground">
          Max 2MB. Square image recommended.
        </p>
      </div>
    </div>
  );
}
