'use client';

import { create } from 'zustand';
import type { ReactNode } from 'react';

export type MessageDialogType = 'success' | 'info' | 'warning' | 'error' | 'alert';

export interface MessageDialogButton {
  text: string;
  onClick?: () => void | Promise<void>;
  redirect?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  closesDialog?: boolean; // If true, dialog closes after onClick or redirect. Defaults to true.
}

export interface MessageDialogState {
  isOpen: boolean;
  title?: string;
  message: string | ReactNode;
  type?: MessageDialogType;
  icon?: ReactNode;
  buttonOne?: MessageDialogButton;
  buttonTwo?: MessageDialogButton;
  onClose?: () => void;
  closeOnOutsideClick?: boolean;
  showDialog: (config: Omit<MessageDialogState, 'isOpen' | 'showDialog' | 'hideDialog'>) => void;
  hideDialog: () => void;
}

export const useMessageDialogStore = create<MessageDialogState>((set, get) => ({
  isOpen: false,
  message: '',
  title: undefined,
  type: 'info',
  icon: undefined,
  buttonOne: undefined,
  buttonTwo: undefined,
  onClose: undefined,
  closeOnOutsideClick: true,

  showDialog: (config) => {
    // If a dialog is already open, call its onClose if it exists before showing new one
    if (get().isOpen && get().onClose) {
      get().onClose?.();
    }
    set({
      ...config,
      isOpen: true,
      // Ensure button defaults if only partial config is provided
      buttonOne: config.buttonOne ? { closesDialog: true, ...config.buttonOne } : undefined,
      buttonTwo: config.buttonTwo ? { closesDialog: true, ...config.buttonTwo } : undefined,
    });
  },

  hideDialog: () => {
    if (get().isOpen) {
      get().onClose?.();
      set({ isOpen: false, title: undefined, message: '', icon: undefined, buttonOne: undefined, buttonTwo: undefined, onClose: undefined });
    }
  },
})); 