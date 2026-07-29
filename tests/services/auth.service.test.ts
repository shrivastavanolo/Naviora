import { afterEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";

import { AuthService } from "@/src/services/auth.services";
import { UserRepository } from "@/src/repositories/user.repository";
import { ConflictError, UnauthorizedError } from "@/src/lib/errors";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("@/src/lib/auth", () => ({
  signVerificationToken: vi.fn().mockResolvedValue("mock-token"),
}));

vi.mock("@/src/repositories/user.repository", () => ({
  UserRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

const makeUser = (overrides = {}) => ({
  id: "user-1",
  name: "Shreya",
  email: "shreya@example.com",
  password: "hashed-password",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("AuthService", () => {
  describe("signup", () => {
    it("should create a new user", async () => {
      const input = {
        name: "Shreya",
        email: "shreya@example.com",
        password: "password123",
      };

      const createdUser = makeUser();

      vi.spyOn(UserRepository, "findByEmail").mockResolvedValue(null);

      vi.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password" as never);

      vi.spyOn(UserRepository, "create").mockResolvedValue(
        createdUser as never
      );

      const result = await AuthService.signup(input);

      expect(UserRepository.findByEmail).toHaveBeenCalledWith(input.email);

      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 12);

      expect(UserRepository.create).toHaveBeenCalledWith({
        ...input,
        password: "hashed-password",
        provider: "email",
      });

      expect(result).toEqual({
        id: "user-1",
        name: "Shreya",
        email: "shreya@example.com",
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      });
    });

    it("should throw when email already exists", async () => {
      vi.spyOn(UserRepository, "findByEmail").mockResolvedValue(
        makeUser() as never
      );

      await expect(
        AuthService.signup({
          name: "Shreya",
          email: "shreya@example.com",
          password: "password123",
        })
      ).rejects.toThrow(ConflictError);

      expect(UserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const user = makeUser();

      vi.spyOn(UserRepository, "findByEmail").mockResolvedValue(user as never);

      vi.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      const result = await AuthService.login({
        email: "shreya@example.com",
        password: "password123",
      });

      expect(UserRepository.findByEmail).toHaveBeenCalledWith(
        "shreya@example.com"
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed-password"
      );

      expect(result).toEqual({
        id: "user-1",
        name: "Shreya",
        email: "shreya@example.com",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it("should throw when email does not exist", async () => {
      vi.spyOn(UserRepository, "findByEmail").mockResolvedValue(null);

      await expect(
        AuthService.login({
          email: "shreya@example.com",
          password: "password123",
        })
      ).rejects.toThrow(UnauthorizedError);

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("should throw when password is incorrect", async () => {
      const user = makeUser();

      vi.spyOn(UserRepository, "findByEmail").mockResolvedValue(user as never);

      vi.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(
        AuthService.login({
          email: "shreya@example.com",
          password: "wrong-password",
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
