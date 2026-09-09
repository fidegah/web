import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import {
  AlertCircleIcon,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "~/lib/utils";

type AlertType = "success" | "error" | "info" | "warning";

interface ShowAlertProps {
  title: string;
  description?: string;
  type: AlertType;
}

interface AlertData extends ShowAlertProps {
  id: string;
  type: AlertType;
}

interface AlertContextType {
  showAlert: (props: ShowAlertProps) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

const ALERT_CONFIG = {
  success: {
    icon: CheckCircle2,
    classes:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]",
    iconClass: "text-emerald-400",
  },
  error: {
    icon: AlertCircleIcon,
    classes:
      "border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_-5px_rgba(244,63,94,0.4)]",
    iconClass: "text-rose-400",
  },
  info: {
    icon: Info,
    classes:
      "border-sky-500/40 bg-sky-500/10 text-sky-400 shadow-[0_0_20px_-5px_rgba(14,165,233,0.4)]",
    iconClass: "text-sky-400",
  },
  warning: {
    icon: TriangleAlert,
    classes:
      "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]",
    iconClass: "text-amber-400",
  },
};

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback(
    ({ title, description, type }: ShowAlertProps) => {
      const id = crypto.randomUUID();

      setAlerts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => removeAlert(id), 5000);
    },
    [removeAlert],
  );

  const contextValue = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 flex flex-col-reverse gap-4 min-w-95 max-w-[80%] pointer-events-none px-4">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => {
            const Config = ALERT_CONFIG[alert.type];
            const Icon = Config.icon;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  y: -20,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  opacity: { duration: 0.2 },
                }}
                className="pointer-events-auto w-full"
              >
                <Alert
                  className={cn(
                    "relative overflow-hidden backdrop-blur-xl border-2",
                    "flex flex-row items-start gap-4 p-4 pr-10",
                    Config.classes,
                  )}
                >
                  <div className={cn("mt-0.5 shrink-0", Config.iconClass)}>
                    <Icon className="size-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <AlertTitle className="text-sm font-bold tracking-tight mb-1">
                      {alert.title}
                    </AlertTitle>
                    {alert.description && (
                      <AlertDescription className="text-sm opacity-80 leading-relaxed wrap-break-word font-medium">
                        {alert.description}
                      </AlertDescription>
                    )}
                  </div>

                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="absolute top-3 right-3 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <X className="size-4" />
                  </button>
                </Alert>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};
