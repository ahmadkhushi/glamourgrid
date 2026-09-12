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
    return { error: 'Please enter email and password.' };
  }

  // ── Hardcoded fallback (works even if DB is offline) ──────
  if (email === HARDCODED_ADMIN_EMAIL && password === HARDCODED_ADMIN_PASSWORD) {
    try {
      await createSession(0, 'ADMIN');
    } catch {
      return { error: 'Failed to create session.' };
    }
    redirect('/admin');
  }

  // ── DB-based auth ─────────────────────────────────────────
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: 'Incorrect email or password.' };

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { error: 'Incorrect email or password.' };

    if (user.role !== 'ADMIN') return { error: 'Admin access is restricted to administrators.' };

    await createSession(user.id, user.role);
  } catch {
    return { error: 'Server error. Please try again.' };
  }


  redirect('/admin');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/admin/login');
}
