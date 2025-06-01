'use client';

import { useRouter } from 'next/navigation';
import { useMessageDialogStore } from '@/stores/messageDialogStore';
import type { MessageDialogType, MessageDialogButton } from '@/stores/messageDialogStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2,
  Info, 
  XCircle, 
} from 'lucide-react';
import type { ReactNode } from 'react';

const typeIcons: Record<MessageDialogType, ReactNode> = {
  success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
  info: <Info className="h-6 w-6 text-blue-500" />,
  warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
  error: <XCircle className="h-6 w-6 text-red-500" />,
  alert: <AlertCircle className="h-6 w-6 text-orange-500" />,
};

export function GlobalMessageDialog() {
  const router = useRouter();
  const {
    isOpen,
    title,
    message,
    type,
    icon,
    buttonOne,
    buttonTwo,
    closeOnOutsideClick,
    hideDialog,
  } = useMessageDialogStore();

  const handleButtonClick = async (button?: MessageDialogButton) => {
    if (!button) return;

    let shouldClose = button.closesDialog !== false; // Default to true

    if (button.onClick) {
      await button.onClick();
    }
    if (button.redirect) {
      router.push(button.redirect);
      shouldClose = true; 
    }
    if (shouldClose) {
      hideDialog();
    }
  };

  if (!isOpen) return null;

  const currentIcon = icon || (type && typeIcons[type]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && hideDialog()}>
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e: Event) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="flex flex-row items-center space-x-3">
          {currentIcon && <div className="flex-shrink-0">{currentIcon}</div>}
          {title && <DialogTitle className="flex-grow">{title}</DialogTitle>}
        </DialogHeader>
        
        {typeof message === 'string' ? (
          <DialogDescription className="py-4 whitespace-pre-wrap">
            {message}
          </DialogDescription>
        ) : (
          <div className="py-4">{message}</div>
        )}

        {(buttonOne || buttonTwo) && (
          <DialogFooter className="sm:justify-start">
            {buttonOne && (
              <Button 
                type="button" 
                variant={buttonOne.variant || 'default'} 
                onClick={() => handleButtonClick(buttonOne)}
              >
                {buttonOne.text}
              </Button>
            )}
            {buttonTwo && (
              <Button 
                type="button" 
                variant={buttonTwo.variant || 'outline'} 
                onClick={() => handleButtonClick(buttonTwo)}
              >
                {buttonTwo.text}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
} 