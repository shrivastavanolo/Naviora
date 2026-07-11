import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthApi } from "@/client/auth";

export function useSignup() {
  return useMutation({
    mutationFn: AuthApi.signup,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: AuthApi.login,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: AuthApi.me,
    retry: false,
  });
}
