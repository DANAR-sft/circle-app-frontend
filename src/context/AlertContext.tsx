import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { AlertContextType, AlertItem } from "@/types/types";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    (
      message: string,
      variant: "default" | "destructive" | "success" = "default",
      title?: string,
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newAlert: AlertItem = { id, message, variant, title };

      setAlerts((prev) => [...prev, newAlert]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeAlert(id);
      }, 5000);
    },
    [removeAlert],
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      showAlert(message, "success", title || "Success");
    },
    [showAlert],
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      showAlert(message, "destructive", title || "Error");
    },
    [showAlert],
  );

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError }}>
      {children}

      {/* Alert Container - Fixed position at top right */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant === "success" ? "default" : alert.variant}
            className={`pointer-events-auto shadow-lg animate-in slide-in-from-right-full duration-300 ${
              alert.variant === "success"
                ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : alert.variant === "destructive"
                  ? "border-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-white dark:bg-neutral-800 dark:text-gray-100"
            }`}
          >
            {alert.variant === "destructive" ? (
              <AlertCircle className="h-4 w-4" />
            ) : alert.variant === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : null}

            <div className="flex-1">
              {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
              <AlertDescription>{alert.message}</AlertDescription>
            </div>

            <button
              onClick={() => removeAlert(alert.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
