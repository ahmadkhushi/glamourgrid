'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/auth-actions';

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#0f0c08] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-[#d4af37] tracking-[0.3em]">GLAMOURGRID</h1>
          <p className="text-[#a89f91] text-xs uppercase tracking-widest mt-2">Admin Panel</p>
        </div>

        <div className="bg-[#16100a] border border-[#2a2018] p-8">
          <h2 className="text-[#d4af37] font-serif text-xl mb-6 tracking-widest text-center">Login</h2>

          <form action={action} className="flex flex-col gap-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@glamourgrid.com"
                className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 placeholder:text-[#a89f91]/40"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a89f91] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#0f0c08] border border-[#2a2018] text-[#FDFBF7] px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]/50 placeholder:text-[#a89f91]/40"
              />
            </div>

            {state?.error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#d4af37] text-[#0f0c08] py-4 font-semibold tracking-widest uppercase hover:bg-[#e8c84a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {pending ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#a89f91]/40 text-xs mt-6 uppercase tracking-widest">
          GlamourGrid Admin — Restricted Access
        </p>
      </div>
    </div>
  );
}
