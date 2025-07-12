import { useState } from "react";
import { AlertTriangle, X, WifiOff } from "lucide-react";

interface DemoModeIndicatorProps {
  isDemoMode: boolean;
}

export function DemoModeIndicator({ isDemoMode }: DemoModeIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isDemoMode || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5" />
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium text-sm md:text-base">
            Demo Mode: Backend not available - using offline demo data
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-900 hover:text-yellow-800 transition-colors p-1"
          title="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
