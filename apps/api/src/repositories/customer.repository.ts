import { prisma } from "../lib/prisma.js";

export const customerRepository = {
  findAll() {
    return prisma.customer.findMany({
      orderBy: [
        { lastName: "asc" },
        { firstName: "asc" },
      ],
    });
  },

  findById(id: number) {
    return prisma.customer.findUnique({
      where: {
        id,
      },
    });
  },

  create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) {
    return prisma.customer.create({
      data,
    });
  },

  update(
    id: number,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return prisma.customer.update({
      where: {
        id,
      },
      data,
    });
  },

  delete(id: number) {
    return prisma.customer.delete({
      where: {
        id,
      },
    });
  },
};