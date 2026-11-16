'use client';

import { useState, useTransition } from 'react';
import type {
  ContactRequest,
  ContactRequestStatus,
} from '@psicoiris/database';
import { Badge, Select, type BadgeVariant } from '@psicoiris/ui';
import { updateContactStatusAction } from '@/app/(protected)/solicitudes/actions';

export interface ContactRequestsListProps {
  initialRequests: ContactRequest[];
}

const STATUS_LABELS: Record<
  ContactRequestStatus,
  { label: string; variant: BadgeVariant }
> = {
  new: { label: 'Nueva', variant: 'rose' },
  reviewed: { label: 'Revisada', variant: 'lavender' },
  scheduled: { label: 'Agendada', variant: 'lavender' },
  archived: { label: 'Archivada', variant: 'outline' },
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function ContactRequestsList({
  initialRequests,
}: ContactRequestsListProps) {
  const [requests, setRequests] = useState<ContactRequest[]>(initialRequests);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(id: string, nextStatus: ContactRequestStatus) {
    setError(null);
    const previous = requests;
    setRequests((curr) =>
      curr.map((req) => (req.id === id ? { ...req, status: nextStatus } : req))
    );

    startTransition(async () => {
      const result = await updateContactStatusAction(id, nextStatus);
      if (!result.ok) {
        setRequests(previous);
        setError(result.message);
      }
    });
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
        Aún no hay solicitudes de contacto registradas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {error}
        </div>
      )}

      {/* Mobile stacked cards (< 768px) */}
      <ul className="space-y-4 md:hidden" aria-label="Solicitudes de contacto">
        {requests.map((req) => {
          const meta = STATUS_LABELS[req.status];
          return (
            <li
              key={req.id}
              className="space-y-3 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-5 shadow-calmed"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <h2 className="font-serif text-lg text-plum-ink">
                    {req.full_name}
                  </h2>
                  <p className="truncate text-xs text-on-surface-variant">
                    {req.email}
                    {req.phone ? ` · ${req.phone}` : ''}
                  </p>
                </div>
                <Badge variant={meta.variant}>{meta.label}</Badge>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium text-plum-ink">{req.reason}</p>
                {req.message && (
                  <p className="leading-relaxed text-on-surface-variant">
                    {req.message}
                  </p>
                )}
                <p className="text-xs text-on-surface-variant">
                  Recibida el {formatDate(req.created_at)}
                </p>
              </div>

              <div className="pt-2">
                <label className="sr-only" htmlFor={`status-mobile-${req.id}`}>
                  Estado de solicitud de {req.full_name}
                </label>
                <Select
                  id={`status-mobile-${req.id}`}
                  value={req.status}
                  disabled={isPending}
                  onChange={(e) =>
                    handleStatusChange(
                      req.id,
                      e.target.value as ContactRequestStatus
                    )
                  }
                >
                  <option value="new">Nueva</option>
                  <option value="reviewed">Revisada</option>
                  <option value="scheduled">Agendada</option>
                  <option value="archived">Archivada</option>
                </Select>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop accessible table (>= 768px) */}
      <div
        role="region"
        aria-label="Tabla de solicitudes de contacto"
        tabIndex={0}
        className="hidden overflow-x-auto rounded-2xl border border-mauve-border/60 bg-surface-container-lowest shadow-calmed md:block"
      >
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-mauve-border/60 bg-surface-container-low/60 text-xs uppercase tracking-wider text-on-surface-variant">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-medium">
                Paciente / Contacto
              </th>
              <th scope="col" className="px-5 py-3.5 font-medium">
                Motivo y mensaje
              </th>
              <th scope="col" className="px-5 py-3.5 font-medium">
                Fecha
              </th>
              <th scope="col" className="px-5 py-3.5 font-medium">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mauve-border/40">
            {requests.map((req) => {
              const meta = STATUS_LABELS[req.status];
              return (
                <tr
                  key={req.id}
                  className="transition-colors hover:bg-surface-container-low/35"
                >
                  <td className="px-5 py-4 align-top">
                    <div className="space-y-1">
                      <p className="font-medium text-plum-ink">{req.full_name}</p>
                      <p className="text-xs text-on-surface-variant">{req.email}</p>
                      {req.phone && (
                        <p className="text-xs text-on-surface-variant">
                          {req.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="max-w-md px-5 py-4 align-top">
                    <p className="font-medium text-plum-ink">{req.reason}</p>
                    {req.message && (
                      <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                        {req.message}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 align-top text-xs text-on-surface-variant">
                    {formatDate(req.created_at)}
                  </td>
                  <td className="min-w-[170px] px-5 py-4 align-top">
                    <div className="space-y-2">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <label className="sr-only" htmlFor={`status-${req.id}`}>
                        Estado de solicitud de {req.full_name}
                      </label>
                      <Select
                        id={`status-${req.id}`}
                        value={req.status}
                        disabled={isPending}
                        onChange={(e) =>
                          handleStatusChange(
                            req.id,
                            e.target.value as ContactRequestStatus
                          )
                        }
                      >
                        <option value="new">Nueva</option>
                        <option value="reviewed">Revisada</option>
                        <option value="scheduled">Agendada</option>
                        <option value="archived">Archivada</option>
                      </Select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
