import { UTApi } from "uploadthing/server";
import { UserRepository } from "@/src/repositories/user.repository";
import { NotFoundError } from "@/src/lib/errors";
import type { UpdateProfileInput } from "@/src/schemas/user";

const utapi = new UTApi();

export class UserService {
  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await UserRepository.update(userId, data);

    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async deleteAccount(userId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.avatar) {
      const fileKey = user.avatar.split("/f/")[1];
      if (fileKey) {
        await utapi.deleteFiles(fileKey);
      }
    }

    await UserRepository.delete(userId);
  }
}
