import * as React from "react";
import { cn } from "@/lib/utils";

/** Canonical ERP table design: Stripe/Linear-style container, header, rows, cells. Used across all /interior routes. */
export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto overflow-y-hidden rounded-xl border bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <table
        className={cn(
          "w-full border-collapse text-left text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader(
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) {
  return (
    <thead
      className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:bg-neutral-900/60"
      {...props}
    />
  );
}

export function TableBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) {
  return <tbody {...props} />;
}

export function TableRow(
  props: React.HTMLAttributes<HTMLTableRowElement>,
) {
  return (
    <tr
      className="border-t border-neutral-100 px-6 py-4 text-sm hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/60"
      {...props}
    />
  );
}

export function TableHead(
  props: React.ThHTMLAttributes<HTMLTableCellElement>,
) {
  return (
    <th
      className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      {...props}
    />
  );
}

export function TableCell(
  props: React.TdHTMLAttributes<HTMLTableCellElement>,
) {
  return (
    <td
      className="whitespace-nowrap px-6 py-4 align-middle text-sm text-neutral-800 dark:text-neutral-100"
      {...props}
    />
  );
}

