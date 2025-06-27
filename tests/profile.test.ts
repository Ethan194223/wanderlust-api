// tests/profile.test.ts
import request from 'supertest';
import app from '../src/server';            // relative path to your Express app

describe('GET /profile/me', () => {
  it('returns 401 when no token', async () => {
    await request(app)                      // call supertest on the app
      .get('/profile/me')
      .expect(401);
  });
});



