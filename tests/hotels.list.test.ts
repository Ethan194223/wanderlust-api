import request from 'supertest';
import app from '@/server';

describe('GET /hotels list', () => {
  it('returns default page', async () => {
    const res = await request(app).get('/hotels');
    expect(res.status).toBe(200);
    expect(res.body.meta).toEqual({
      page: 1,
      limit: 20,
      total: expect.any(Number),
    });
  });

  it('filters by city', async () => {
    const res = await request(app).get('/hotels').query({ city: 'HK' });
    expect(res.status).toBe(200);
    res.body.data.forEach((h: any) =>
      expect(h.city.toLowerCase()).toBe('hk'),
    );
  });

  it('rejects invalid page', async () => {
    const res = await request(app).get('/hotels').query({ page: 'zero' });
    expect(res.status).toBe(422);
  });
});

