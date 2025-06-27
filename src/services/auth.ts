// src/services/auth.ts
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type Role = 'PUBLIC' | 'OPERATOR';

/* helper ------------------------------------------------------------------- */
function signToken(id: string, role: Role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

/* login -------------------------------------------------------------------- */
export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Invalid credentials');
  }
  return signToken(user.id, user.role as Role);
}

/* register ----------------------------------------------------------------- */
export async function register(args: {
  email: string;
  password: string;
  signUpCode?: string;
}) {
  const role: Role =
    args.signUpCode === process.env.OPERATOR_SIGNUP_CODE ? 'OPERATOR' : 'PUBLIC';

  const user = await prisma.user.create({
    data: {
      email: args.email,
      passwordHash: await bcrypt.hash(args.password, 10),
      role,
    },
  });

  return signToken(user.id, role);
}

/* NEW  ➜  read own profile -------------------------------------------------- */
export async function getMe(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');
  return user;
}

/* default export so `import Auth from…` works ------------------------------- */
export default { authenticate, register, getMe };



