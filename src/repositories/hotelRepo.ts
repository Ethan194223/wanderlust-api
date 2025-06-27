// src/repositories/hotelRepo.ts
import { prisma } from '../utils/prisma';            // shared Prisma instance
import { Hotel } from '@prisma/client';

export const HotelRepo = {
  /*───────────────────────────*
   *        C R E A T E        *
   *───────────────────────────*/

  /** Insert a new hotel (DB fills in `id` & `createdAt`). */
  create(data: Omit<Hotel, 'id' | 'createdAt'>) {
    return prisma.hotel.create({ data });
  },

  /*───────────────────────────*
   *          R E A D          *
   *───────────────────────────*/

  /** List every hotel that matches the optional filter object. */
  list(filters: Partial<Hotel> = {}) {
    return prisma.hotel.findMany({ where: filters });
  },

  /** Fetch exactly one hotel by primary key. */
  findById(id: string) {
    return prisma.hotel.findUnique({ where: { id } });
  },

  /*───────────────────────────*
   *        U P D A T E        *
   *───────────────────────────*/

  /** Patch only the fields supplied in `data`. */
  update(id: string, data: Partial<Hotel>) {
    return prisma.hotel.update({ where: { id }, data });
  },

  /*───────────────────────────*
   *        D E L E T E        *
   *───────────────────────────*/

  /**
   * Permanently delete a hotel by id.
   * Prismas `deleteMany → { count }` **never throws** when zero rows match,
   * so the caller can translate `count` into 204 (deleted) or 404 (not-found).
   */
  async remove(id: string) {
    const { count } = await prisma.hotel.deleteMany({ where: { id } });
    return count;        // 1 ⇢ a row was removed, 0 ⇢ nothing matched
  },
};
