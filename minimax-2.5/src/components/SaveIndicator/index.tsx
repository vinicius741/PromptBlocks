import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface SaveIndicatorProps {
  status: SaveStatus;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'saved':
        return {
          icon: <Check size={14} />,
          text: 'Saved',
          className: 'text-green-600',
        };
      case 'saving':
        return {
          icon: <Loader2 size={14} className="animate-spin" />,
          text: 'Saving...',
          className: 'text-slate-500',
        };
      case 'unsaved':
        return {
          icon: <AlertCircle size={14} />,
          text: 'Unsaved changes',
          className: 'text-amber-500',
        };
      case 'error':
        return {
          icon: <AlertCircle size={14} />,
          text: 'Save failed',
          className: 'text-red-500',
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};
