import { prisma } from "@/src/lib/prisma";

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

  static update(
    id: string,
    data: { name?: string; bio?: string; avatar?: string }
  ) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
