'use server';

import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// Hardcoded fallback admin credentials
const HARDCODED_ADMIN_EMAIL = 'admin@glamourgrid.com';
const HARDCODED_ADMIN_PASSWORD = 'hafiz123451122';

export async function loginAction(prevState: { error: string } | null, formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email aur password daalein.' };
  }

  // ── Hardcoded fallback (works even if DB is offline) ──────
  if (email === HARDCODED_ADMIN_EMAIL && password === HARDCODED_ADMIN_PASSWORD) {
    try {
      await createSession(0, 'ADMIN');
    } catch {
      return { error: 'Session create karne mein error.' };
    }
    redirect('/admin');
  }

  // ── DB-based auth ─────────────────────────────────────────
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: 'Email ya password galat hai.' };

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { error: 'Email ya password galat hai.' };

    if (user.role !== 'ADMIN') return { error: 'Admin access sirf admins ke liye hai.' };

    await createSession(user.id, user.role);
  } catch {
    return { error: 'Server error. Dobara try karein.' };
  }

  redirect('/admin');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/admin/login');
}
