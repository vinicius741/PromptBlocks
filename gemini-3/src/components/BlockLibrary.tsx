import React from 'react';
import { 
  UserCircle, 
  Target, 
  FileText, 
  ListChecks, 
  Music, 
  Layout, 
  MessageSquare,
  Plus
} from 'lucide-react';
import type { BlockType } from '../types/blocks';

interface BlockLibraryProps {
  onAddBlock: (type: BlockType) => void;
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'role', label: 'Role', icon: <UserCircle size={18} />, description: 'Define the AI persona' },
  { type: 'task', label: 'Task', icon: <Target size={18} />, description: 'What the AI should do' },
  { type: 'context', label: 'Context', icon: <FileText size={18} />, description: 'Background information' },
  { type: 'constraints', label: 'Constraints', icon: <ListChecks size={18} />, description: 'Rules and limitations' },
  { type: 'tone', label: 'Tone', icon: <Music size={18} />, description: 'Style of the output' },
  { type: 'output_format', label: 'Output Format', icon: <Layout size={18} />, description: 'Plain text, JSON, etc.' },
  { type: 'examples', label: 'Examples', icon: <MessageSquare size={18} />, description: 'Few-shot examples' },
];

const BlockLibrary: React.FC<BlockLibraryProps> = ({ onAddBlock }) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Library</h2>
      <div className="space-y-3">
        {BLOCK_TYPES.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddBlock(item.type)}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="p-2 bg-white rounded-md text-gray-500 group-hover:text-blue-600 shadow-sm transition-colors">
              {item.icon}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <Plus size={14} className="text-gray-400 group-hover:text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlockLibrary;
