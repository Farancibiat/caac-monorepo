'use client';

import { useMessageDialogStore } from '@/stores/messageDialogStore';
import type { MessageDialogState } from '@/stores/messageDialogStore';

export const useMessageDialog = () => {
  const { showDialog, hideDialog, isOpen } = useMessageDialogStore((state: MessageDialogState) => ({
    showDialog: state.showDialog,
    hideDialog: state.hideDialog,
    isOpen: state.isOpen,
  }));

  return {
    showDialog: (config: Omit<MessageDialogState, 'isOpen' | 'showDialog' | 'hideDialog'>) => showDialog(config),
    hideDialog,
    isDialogOpen: isOpen,
  };
}; 