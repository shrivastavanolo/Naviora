import { prisma } from "@/db/prisma";

export class UserRepository {
  static findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  static create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
    });
  }
}
