import { createContext, useContext, useState, useCallback } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-lg border p-4 shadow-lg bg-background text-foreground animate-in slide-in-from-bottom-5 fade-in-0",
              t.variant === "destructive" && "border-destructive text-destructive"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                {t.title && <div className="text-sm font-semibold">{t.title}</div>}
                {t.description && <div className="text-sm mt-1 text-muted-foreground">{t.description}</div>}
              </div>
              <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
