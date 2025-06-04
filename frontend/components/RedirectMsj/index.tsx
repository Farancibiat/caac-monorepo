import React from 'react';
import { cn } from '@/lib/shadcn-utils';
import { Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface RedirectMsjProps {
  message?: string;
  location: string;
  variant?: 'loading' | 'success' | 'warning' | 'error';
  showSpinner?: boolean;
  className?: string;
}

const variantConfig = {
  loading: {
    bgGradient: 'from-primary-50 to-ocean-50',
    textColor: 'text-neutral-600',
    icon: Loader2,
    iconColor: 'text-primary-600'
  },
  success: {
    bgGradient: 'from-green-50 to-green-100',
    textColor: 'text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  warning: {
    bgGradient: 'from-amber-50 to-amber-100',
    textColor: 'text-amber-800',
    icon: AlertCircle,
    iconColor: 'text-amber-600'
  },
  error: {
    bgGradient: 'from-red-50 to-red-100',
    textColor: 'text-red-800',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
};

export const RedirectMsj: React.FC<RedirectMsjProps> = ({
  message,
  location,
  variant = 'loading',
  showSpinner = true,
  className
}) => {
  const { bgGradient, textColor, icon: Icon, iconColor } = variantConfig[variant];

  const displayMessage = message || `${variant === 'error' ? 'Error. ' : ''}Redirigiendo a ${location}...`;

  const showLoader = showSpinner && variant === 'loading';

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-gradient-to-br",
      bgGradient,
      className
    )}>
      <div className="text-center space-y-4 max-w-md mx-auto px-4">
        <div className="flex justify-center">
          <Icon className={cn("h-12 w-12", iconColor, showLoader && "animate-spin")} />
        </div>

        <div className="space-y-2">
          <p className={cn("text-lg font-semibold", textColor)}>
            {displayMessage}
          </p>
          {message && (
            <p className={cn("text-sm opacity-80", textColor)}>
              Destino: {location}
            </p>
          )}
        </div>

        {variant === 'loading' && (
          <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary-600 h-1.5 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RedirectMsj; 