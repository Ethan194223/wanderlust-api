/*src/routes/auth.ts  */
import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const router = Router();

// ---------- Schemas ----------
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  signupCode: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ---------- Helpers ----------
function signToken(id: string, role: "operator" | "public") {
  return jwt.sign({ sub: id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "2h",
  });
}

// ---------- Routes ----------
router.post("/register", async (req: Request, res: Response) => {
  // 1. Validate
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ errors: parse.error.flatten() });
  }
  const { email, password, signupCode } = parse.data;

  // 2. Sign-up-code gate
  if (signupCode !== process.env.SIGNUP_CODE) {
    return res.status(403).json({ message: "Invalid sign-up code" });
  }

  // 3. Hash pw & create user
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: "operator" },
  });

  // 4. JWT
  const token = signToken(user.id, "operator");
  return res.status(201).json({ token });
});

router.post("/login", async (req: Request, res: Response) => {
  // 1. Validate
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(422).json({ errors: parse.error.flatten() });
  }
  const { email, password } = parse.data;

  // 2. Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 3. Verify pw
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 4. JWT
  const token = signToken(user.id, user.role as "operator" | "public");
  return res.status(200).json({ token });
});

export default router;

