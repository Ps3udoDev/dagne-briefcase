'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, FilePlus2, Pencil, Search, Trash2 } from 'lucide-react';
import type {
  PostCategory,
  PostInput,
  PostWithCategory,
} from '@psicoiris/database';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  type BadgeVariant,
} from '@psicoiris/ui';
import { deletePostAction } from '@/app/(protected)/posts/actions';
import { PostEditorForm } from '@/components/PostEditorForm';

export interface PostsTableProps {
  initialPosts: PostWithCategory[];
  categories: PostCategory[];
  initialOpenCreate?: boolean;
}

const EMPTY_POST_INPUT: PostInput = {
  title: '',
  slug: '',
  excerpt: '',
  content_md: '',
  category_id: null,
  cover_image_url: '',
  cover_image_alt: '',
  reading_time_minutes: 4,
  tags: [],
  references_list: [],
  status: 'draft',
  seo_title: '',
  seo_description: '',
};

function toPostInput(post: PostWithCategory): PostInput {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content_md: post.content_md,
    category_id: post.category_id,
    cover_image_url: post.cover_image_url ?? '',
    cover_image_alt: post.cover_image_alt ?? '',
    reading_time_minutes: post.reading_time_minutes,
    tags: post.tags ?? [],
    references_list: post.references_list ?? [],
    status: post.status,
    seo_title: post.seo_title ?? '',
    seo_description: post.seo_description ?? '',
  };
}

const STATUS_META: Record<
  PostWithCategory['status'],
  { label: string; variant: BadgeVariant }
> = {
  published: { label: 'Publicado', variant: 'lavender' },
  draft: { label: 'Borrador', variant: 'rose' },
  archived: { label: 'Archivado', variant: 'outline' },
};

const columnHelper = createColumnHelper<PostWithCategory>();

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function PostsTable({
  initialPosts,
  categories,
  initialOpenCreate = false,
}: PostsTableProps) {
  const [posts, setPosts] = useState<PostWithCategory[]>(initialPosts);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updated_at', desc: true },
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(initialOpenCreate);
  const [editingPost, setEditingPost] = useState<PostWithCategory | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  function openCreateModal() {
    setEditingPost(null);
    setModalOpen(true);
  }

  function openEditModal(post: PostWithCategory) {
    setEditingPost(post);
    setModalOpen(true);
  }

  function handleDelete(post: PostWithCategory) {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción es permanente.`)) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await deletePostAction(post.id);
      if (result.ok) {
        setPosts((prev) => prev.filter((item) => item.id !== post.id));
      } else {
        setFeedback(result.message);
      }
    });
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Título',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="min-w-[200px] space-y-1">
              <button
                type="button"
                onClick={() => openEditModal(row)}
                className="text-left font-medium text-plum-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {row.title}
              </button>
              <p className="text-xs text-on-surface-variant">
                {row.post_categories?.name ?? 'Sin categoría'} ·{' '}
                {row.reading_time_minutes} min
              </p>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Estado',
        cell: (info) => {
          const meta = STATUS_META[info.getValue()];
          return <Badge variant={meta.variant}>{meta.label}</Badge>;
        },
      }),
      columnHelper.accessor('updated_at', {
        header: 'Actualizado',
        cell: (info) => (
          <span className="whitespace-nowrap text-sm text-on-surface-variant">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="sr-only">Acciones</span>,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => openEditModal(row)}
                aria-label={`Editar ${row.title}`}
                className="min-w-[48px] px-3 text-plum-ink"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                aria-label={`Eliminar ${row.title}`}
                onClick={() => handleDelete(row)}
                className="min-w-[48px] px-3 text-error hover:bg-error/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          );
        },
      }),
    ],
    [isPending]
  );

  const table = useReactTable({
    data: posts,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
          />
          <Input
            type="search"
            aria-label="Buscar publicaciones"
            placeholder="Buscar por título o categoría..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          type="button"
          onClick={openCreateModal}
          className="w-full sm:w-auto"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          Nueva publicación
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Editar publicación' : 'Nueva publicación'}
            </DialogTitle>
            <DialogDescription>
              {editingPost
                ? 'Actualiza el contenido, portada o referencias y guarda para reflejarlo en la landing.'
                : 'Redacta un nuevo artículo psicoeducativo y súbelo como borrador o publicado.'}
            </DialogDescription>
          </DialogHeader>
          <PostEditorForm
            key={editingPost?.id ?? 'new-post'}
            postId={editingPost?.id}
            initialData={editingPost ? toPostInput(editingPost) : EMPTY_POST_INPUT}
            categories={categories}
            embedded
            onSuccess={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {feedback && (
        <div
          role="alert"
          className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {feedback}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant">
          No se encontraron publicaciones.
        </div>
      ) : (
        <>
          {/* Mobile stacked cards (< 768px) */}
          <ul className="space-y-4 md:hidden" aria-label="Publicaciones">
            {rows.map((row) => {
              const post = row.original;
              const meta = STATUS_META[post.status];
              return (
                <li
                  key={post.id}
                  className="space-y-3 rounded-2xl border border-mauve-border/60 bg-surface-container-lowest p-5 shadow-calmed"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(post)}
                        className="block text-left font-serif text-lg text-plum-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {post.title}
                      </button>
                      <p className="text-xs text-on-surface-variant">
                        {post.post_categories?.name ?? 'Sin categoría'} ·{' '}
                        {formatDate(post.updated_at)}
                      </p>
                    </div>
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-mauve-border/40 pt-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => openEditModal(post)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => handleDelete(post)}
                      className="text-error hover:bg-error/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Eliminar
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Desktop accessible table (>= 768px) */}
          <div
            role="region"
            aria-label="Tabla de publicaciones"
            tabIndex={0}
            className="hidden overflow-x-auto rounded-2xl border border-mauve-border/60 bg-surface-container-lowest shadow-calmed md:block"
          >
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-mauve-border/60 bg-surface-container-low/60 text-xs uppercase tracking-wider text-on-surface-variant">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      return (
                        <th key={header.id} scope="col" className="px-5 py-3.5 font-medium">
                          {canSort ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex min-h-[40px] items-center gap-1.5 hover:text-plum-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-mauve-border/40">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-surface-container-low/35"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
