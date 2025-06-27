// src/repositories/hotelRepo.ts
import { prisma } from '../utils/prisma';
import { Hotel, Prisma } from '@prisma/client';

/** All writable fields (DB fills `id` and `createdAt`). */
type HotelInput = Omit<Hotel, 'id' | 'createdAt'>;

export const HotelRepo = {
  /*───────────── C R E A T E ─────────────*/
  create(data: HotelInput) {
    return prisma.hotel.create({ data });
  },

  /*────────────── R E A D ───────────────*/
  list(filters: Partial<HotelInput> = {}) {
    return prisma.hotel.findMany({ where: filters });
  },

  findById(id: string) {
    return prisma.hotel.findUnique({ where: { id } });
  },

  /*────────────── U P D A T E ───────────────*/
  update(id: string, data: Partial<HotelInput>) {
    return prisma.hotel.update({ where: { id }, data });
  },

  /*────────────── D E L E T E ───────────────*/
  /**
   * Permanently delete a hotel by ID.
   * Returns `1` when a row was removed, `0` when nothing matched.
   */
  async remove(id: string) {
    const { count } = await prisma.hotel.deleteMany({ where: { id } });
    return count;
  },
};
