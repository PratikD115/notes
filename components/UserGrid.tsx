"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

ModuleRegistry.registerModules([AllCommunityModule]);

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  status: number;
  role: number;
};

export default function UserGrid() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fetchUsers = useCallback(async (requestedPage = page, requestedPageSize = pageSize) => {
    const response = await fetch(`/api/users?page=${requestedPage}&pageSize=${requestedPageSize}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message ?? "Failed to fetch users");
    setUsers(result.data);
    setTotal(result.pagination.total);
  }, [page, pageSize]);

  // The request synchronizes the grid with the database after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers().catch((fetchError: unknown) => {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch users");
    });
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

  const columnDefs: ColDef<User>[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "email",
      headerName: "Email",
    },
    {
      field: "age",
      headerName: "Age",
    },
    {
      field: "status",
      headerName: "Status",
    },
    {
      field: "role",
      headerName: "Role",
    },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setIsSaving(true);
    setError("");
    const form = new FormData(formElement);
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), email: form.get("email"), age: Number(form.get("age")) }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.message ?? "Failed to create user");
      setIsSaving(false);
      return;
    }
    formElement.reset();
    dialogRef.current?.close();
    await fetchUsers();
    setIsSaving(false);
  }

  return (
    <section className="flex h-full min-h-[380px] w-full flex-col">
      <div className="mb-2 flex items-center justify-end">
        <Button type="button" size="sm" className="rounded-lg" onClick={() => dialogRef.current?.showModal()}>
          Add user
        </Button>
      </div>
      {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      <div className="ag-theme-quartz min-h-[300px] w-full flex-1 overflow-hidden rounded-lg border" style={{ "--ag-background-color": "#ffffff", "--ag-foreground-color": "#334155", "--ag-header-background-color": "#f8faf9", "--ag-header-foreground-color": "#64748b", "--ag-border-color": "#e7ebe8", "--ag-row-hover-color": "#f2f8f5", "--ag-font-family": "Arial, Helvetica, sans-serif", "--ag-font-size": "13px" } as React.CSSProperties}>
        <AgGridReact<User>
          rowData={users}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, minWidth: 100, resizable: true }}
        />
      </div>
      <div className="flex min-h-9 shrink-0 items-center justify-between gap-2 border-t pt-2 text-xs text-muted-foreground">
        <span>Showing {firstRow}–{lastRow} of {total}</span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            Rows
            <select
              className="h-8 rounded-lg border bg-white px-2 text-xs text-foreground"
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {[10, 25, 50].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
          <span>Page {page} of {totalPages}</span>
          <Button size="xs" variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button size="xs" variant="outline" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </div>
      </div>
      <dialog ref={dialogRef} className="m-auto w-[calc(100%-1rem)] max-w-md rounded-2xl border bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/25">
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold tracking-tight">Add a user</h2>
            <p className="text-sm text-muted-foreground">Enter the details to add them to your workspace.</p>
          </div>
          <label className="block text-xs font-medium">Name<Input name="name" required className="mt-1.5 rounded-lg bg-slate-50/70" /></label>
          <label className="block text-xs font-medium">Email<Input name="email" type="email" required className="mt-1.5 rounded-lg bg-slate-50/70" /></label>
          <label className="block text-xs font-medium">Age<Input name="age" type="number" min="0" required className="mt-1.5 rounded-lg bg-slate-50/70" /></label>
          <div className="flex justify-end gap-1.5 pt-1">
            <Button type="button" size="sm" variant="outline" onClick={() => dialogRef.current?.close()}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isSaving}>{isSaving ? "Saving..." : "Save User"}</Button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
