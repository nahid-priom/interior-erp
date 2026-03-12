"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheet() {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error("Sheet components must be used within a Sheet");
  return ctx;
}

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open: !!open, onOpenChange: onOpenChange ?? (() => {}) }}>
      {children}
    </SheetContext.Provider>
  );
}

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  onClose?: () => void;
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, side = "right", children, onClose, ...props }, ref) => {
    const { open, onOpenChange } = useSheet();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false);
      };
      if (open) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [open, onOpenChange]);

    const handleOverlayClick = () => {
      onOpenChange(false);
      onClose?.();
    };

    if (!open) return null;

    const content = (
      <>
        <div
          role="presentation"
          className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-200"
          onClick={handleOverlayClick}
        />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            "fixed z-50 flex flex-col gap-4 bg-white shadow-lg transition-transform duration-300 ease-out dark:bg-neutral-900",
            side === "right" &&
              "inset-y-0 right-0 h-full w-full border-l border-neutral-200 sm:max-w-xl",
            side === "left" &&
              "inset-y-0 left-0 h-full w-full border-r border-neutral-200 sm:max-w-xl",
            side === "top" &&
              "inset-x-0 top-0 h-auto max-h-[85vh] border-b border-neutral-200",
            side === "bottom" &&
              "inset-x-0 bottom-0 h-auto max-h-[85vh] border-t border-neutral-200",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </>
    );

    if (mounted && typeof document !== "undefined") {
      return createPortal(content, document.body);
    }
    return null;
  },
);
SheetContent.displayName = "SheetContent";

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6 pb-4 text-left",
        className,
      )}
      {...props}
    />
  );
}

export interface SheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight text-neutral-900 dark:text-neutral-50",
        className,
      )}
      {...props}
    />
  );
}

export interface SheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
      {...props}
    />
  );
}

export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 p-6 pt-0 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export interface SheetCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SheetClose({ className, ...props }: SheetCloseProps) {
  const { onOpenChange } = useSheet();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("absolute right-4 top-4 h-8 w-8 rounded-full", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
