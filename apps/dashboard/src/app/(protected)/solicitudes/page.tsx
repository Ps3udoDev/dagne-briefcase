import { getContactRequests } from '@psicoiris/database/server';
import { ContactRequestsList } from '@/components/ContactRequestsList';

export const dynamic = 'force-dynamic';

export default async function ContactRequestsPage() {
  const requests = await getContactRequests();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Seguimiento
        </p>
        <h1 className="font-serif text-3xl font-normal text-plum-ink md:text-4xl">
          Solicitudes de contacto
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
          Consulta los mensajes recibidos desde el formulario público y
          actualiza su estado de seguimiento.
        </p>
      </header>

      <ContactRequestsList initialRequests={requests} />
    </div>
  );
}
