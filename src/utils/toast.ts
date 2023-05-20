import { window } from 'vscode';

const toast = {
  error: async (message: string): Promise<void> => {
    await window.showErrorMessage(message);
  },
  success: async (message: string): Promise<void> => {
    await window.showInformationMessage(message);
  },
};

export default toast;
