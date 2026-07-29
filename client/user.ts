import { api } from "@/lib/api";
import type { User } from "@/src/types/user";
import type { UpdateProfileInput } from "@/src/schemas/user";

export const UserApi = {
  getProfile() {
    return api<User>("/user");
  },

  updateProfile(data: UpdateProfileInput) {
    return api<User>("/user", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteAccount() {
    return api("/user", {
      method: "DELETE",
    });
  },
};
