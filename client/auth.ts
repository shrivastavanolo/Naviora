import { api } from "@/lib/api";
import type { SignupInput, LoginInput } from "@/src/schemas/auth";
import type { User } from "@/types/user";

export const AuthApi = {
  signup(data: SignupInput) {
    return api("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login(data: LoginInput) {
    return api("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me() {
    return api<User>("/auth/me");
  },

  logout() {
    return api("/auth/logout", {
      method: "POST",
    });
  },
};
