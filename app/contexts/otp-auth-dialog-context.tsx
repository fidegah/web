import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { User } from "~/types";

export type AuthStep = "email" | "otp" | "profile";

interface OtpAuthDialogContextValue {
  isOpen: boolean;
  step: AuthStep;
  isProfileLocked: boolean;
  setStep: (step: AuthStep) => void;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
}

const OtpAuthDialogContext = createContext<OtpAuthDialogContextValue | null>(
  null,
);

interface OtpAuthDialogProviderProps {
  children: ReactNode;
  user?: User | null;
}

export function OtpAuthDialogProvider({
  children,
  user,
}: OtpAuthDialogProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<AuthStep>("email");

  const isProfileLocked = Boolean(user && !user.fullName);
  const isProfileLockedRef = useRef(isProfileLocked);
  isProfileLockedRef.current = isProfileLocked;

  useEffect(() => {
    if (isProfileLocked) {
      setStep("profile");
      setIsOpen(true);
    }
  }, [isProfileLocked]);

  const openAuthDialog = useCallback(() => {
    if (isProfileLockedRef.current) return;
    setStep("email");
    setIsOpen(true);
  }, []);

  const closeAuthDialog = useCallback(() => {
    if (isProfileLockedRef.current) return;
    setIsOpen(false);
    setStep("email");
  }, []);

  return (
    <OtpAuthDialogContext.Provider
      value={{
        isOpen,
        step,
        isProfileLocked,
        setStep,
        openAuthDialog,
        closeAuthDialog,
      }}
    >
      {children}
    </OtpAuthDialogContext.Provider>
  );
}

export function useOtpAuthDialog() {
  const context = useContext(OtpAuthDialogContext);
  if (!context) {
    throw new Error(
      "useOtpAuthDialog must be used within OtpAuthDialogProvider",
    );
  }
  return context;
}
