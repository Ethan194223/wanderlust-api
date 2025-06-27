/**
 * Happy-path authentication flow
 * 1️⃣ POST /auth/register → 201
 * 2️⃣ POST /auth/login    → 200 (grabs JWT)
 * 3️⃣ GET  /profile/me    → 200 (Bearer token)
 *
 * Run: pnpm test -- tests/auth.happy.test.ts
 */

import request from 'supertest';
import app from '../src/server';        // server.ts exports the Express app

const agent = request(app);

describe('Auth › happy path', () => {
  const email = `happy.${Date.now()}@example.com`;
  const password = 'P@ssw0rd123';
  const name = 'Happy User';

  // ------------- 1️⃣ register -----------------
  it('registers a new user (201)', async () => {
    await agent
      .post('/auth/register')
      .send({ email, password, name })
      .expect(201)
      .expect(res =>
        expect(res.body).toEqual(
          expect.objectContaining({ id: expect.any(String), email })
        )
      );
  });

  // will hold the JWT returned by /auth/login
  let token!: string;   //  ← fixed (non-null assertion)

  // ------------- 2️⃣ login --------------------
  it('logs the user in and returns a JWT (200)', async () => {
    const res = await agent
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    token = res.body.token;
    expect(token).toBeTruthy();
  });

  // ------------- 3️⃣ profile/me ---------------
  it('fetches the current profile with Bearer token (200)', async () => {
    await agent
      .get('/profile/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res =>
        expect(res.body).toMatchObject({ email, name })
      );
  });
});
