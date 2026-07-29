import { prisma } from "@/src/lib/prisma";

export class UserRepository {
  static findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, provider: "email" },
    });
  }

  static findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  static create(data: { name: string; email: string; password?: string; provider?: string; providerId?: string }) {
    return prisma.user.create({
      data,
    });
  }

  static findByProvider(provider: string, providerId: string) {
    return prisma.user.findUnique({
      where: { provider_providerId: { provider, providerId } },
    });
  }

  static update(
    id: string,
    data: { name?: string; bio?: string; avatar?: string; emailVerified?: Date }
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
