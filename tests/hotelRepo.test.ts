// tests/hotelRepo.test.ts
import { HotelRepo } from '../src/repositories/hotelRepo';
import { prisma } from '../src/utils/prisma';

describe('HotelRepo.remove', () => {
  it('returns 0 when id is missing', async () => {
    const count = await HotelRepo.remove('non-existent-id');
    expect(count).toBe(0);
  });
});
