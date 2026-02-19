import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BLOCK_TYPE_DEFINITIONS, BlockTypeDefinition } from '../../types/blocks';
import { User, Target, FileText, AlertTriangle, Music, Layout, BookOpen } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  User,
  Target,
  FileText,
  AlertTriangle,
  Music,
  Layout,
  BookOpen,
};

interface DraggableBlockTypeProps {
  definition: BlockTypeDefinition;
}

const DraggableBlockType: React.FC<DraggableBlockTypeProps> = ({ definition }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${definition.type}`,
    data: {
      type: 'blockType',
      definition,
    },
  });

  const Icon = iconMap[definition.icon];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-grab transition-all ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:border-slate-300 hover:shadow-sm'
      }`}
      style={{ borderLeftColor: definition.color, borderLeftWidth: '3px' }}
    >
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center"
        style={{ backgroundColor: `${definition.color}15` }}
      >
        <Icon size={18} style={{ color: definition.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800">{definition.label}</div>
        <div className="text-xs text-slate-500 truncate">{definition.description}</div>
      </div>
    </div>
  );
};

interface BlockLibraryProps {
  className?: string;
}

export const BlockLibrary: React.FC<BlockLibraryProps> = ({ className = '' }) => {
  return (
    <div className={`bg-slate-50 border-l border-slate-200 h-full overflow-y-auto ${className}`}>
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Block Library</h2>
        <p className="text-xs text-slate-500 mt-1">Drag blocks to the canvas</p>
      </div>
      <div className="p-3 space-y-2">
        {BLOCK_TYPE_DEFINITIONS.map((definition) => (
          <DraggableBlockType key={definition.type} definition={definition} />
        ))}
      </div>
    </div>
  );
};
