import { prisma } from './prismaClient';          // ◄ same helper you use for User
import { Hotel } from '@prisma/client';

export const HotelRepo = {
  create(data: Omit<Hotel, 'id' | 'createdAt'>) {
    return prisma.hotel.create({ data });
  },
  list(filters: Partial<Hotel> = {}) {
    return prisma.hotel.findMany({ where: filters });
  },
  findById(id: string) {
    return prisma.hotel.findUnique({ where: { id } });
  },
  update(id: string, data: Partial<Hotel>) {
    return prisma.hotel.update({ where: { id }, data });
  },
  remove(id: string) {
    return prisma.hotel.delete({ where: { id } });
  },
};
