'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { createBrowserSupabaseClient } from '@psicoiris/database';
import { AmbientCanvas, Reveal } from '@psicoiris/motion';
import { BrandMark, Button, FormField, Input } from '@psicoiris/ui';

const ALLOWED_ADMIN_EMAIL = 'dagneraza123@gmail.com';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ALLOWED_ADMIN_EMAIL) {
      setError(
        `Acceso restringido. Solo la cuenta autorizada (${ALLOWED_ADMIN_EMAIL}) puede ingresar al panel.`
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (signInError) {
        setError(
          'Credenciales inválidas. Verifica tu correo y contraseña e intenta nuevamente.'
        );
        return;
      }

      if (data.user?.email?.toLowerCase() !== ALLOWED_ADMIN_EMAIL) {
        await supabase.auth.signOut();
        setError(
          `Esta cuenta no tiene permisos de administración. Usa ${ALLOWED_ADMIN_EMAIL}.`
        );
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Ocurrió un error al conectar con el servicio de autenticación.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-5 py-12">
      <AmbientCanvas
        className="pointer-events-none fixed inset-0 z-0 opacity-75"
        particleCount={36}
      />

      <Reveal className="relative z-10 w-full max-w-md">
        <section className="rounded-3xl border border-mauve-border/70 bg-surface-container-lowest/95 p-6 shadow-calmed backdrop-blur-sm md:p-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <BrandMark size={48} subtitle="Panel Clínico" idPrefix="dash-login" />
            <h1 className="mt-6 font-serif text-2xl font-normal text-plum-ink md:text-3xl">
              Bienvenida de nuevo
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              Ingresa con tu cuenta profesional para gestionar el portafolio,
              publicaciones y solicitudes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField label="Correo electrónico" htmlFor="login-email" required>
              <Input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={ALLOWED_ADMIN_EMAIL}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Contraseña" htmlFor="login-password" required>
              <Input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormField>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <Lock className="h-4 w-4" aria-hidden="true" />
              {loading ? 'Verificando acceso...' : 'Ingresar al panel'}
            </Button>
          </form>
        </section>
      </Reveal>
    </main>
  );
}
