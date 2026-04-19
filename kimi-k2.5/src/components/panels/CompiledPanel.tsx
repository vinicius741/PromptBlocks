import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { compilePrompt } from '@/lib/compiler';
import type { BlockInstance } from '@/types/blocks';

interface CompiledPanelProps {
  blocks: BlockInstance[];
  saveStatus: 'saved' | 'saving' | 'unsaved';
  onSaveNow: () => void;
}

export function CompiledPanel({ blocks, saveStatus, onSaveNow }: CompiledPanelProps) {
  const [copied, setCopied] = useState(false);

  const compiledText = compilePrompt(blocks);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiledText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saved':
        return { text: 'Saved', color: 'text-green-600', icon: Check };
      case 'saving':
        return { text: 'Saving...', color: 'text-yellow-600', icon: RefreshCw };
      case 'unsaved':
        return { text: 'Unsaved changes', color: 'text-orange-600', icon: RefreshCw };
      default:
        return { text: 'Unknown', color: 'text-gray-600', icon: Check };
    }
  };

  const status = getSaveStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div className="h-full flex flex-col bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-gray-900">Compiled Prompt</h3>
          <div className={`flex items-center gap-1.5 text-xs ${status.color}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${saveStatus === 'saving' ? 'animate-spin' : ''}`} />
            <span>{status.text}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'unsaved' && (
            <button
              onClick={onSaveNow}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Save now
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {compiledText ? (
          <pre className="w-full h-full p-4 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 whitespace-pre-wrap overflow-auto">
            {compiledText}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-sm font-medium">No content yet</p>
              <p className="text-xs mt-1">Add blocks to the canvas to see the compiled prompt</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}