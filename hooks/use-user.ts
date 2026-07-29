import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "@/client/user";
import type { UpdateProfileInput } from "@/src/schemas/user";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => UserApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserApi.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
