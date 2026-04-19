import { useDraggable } from '@dnd-kit/core';
import type { BlockType, BlockTypeConfig } from '@/types/blocks';
import { BLOCK_TYPE_REGISTRY } from '@/types/blocks';
import {
  User,
  Target,
  Info,
  Shield,
  MessageSquare,
  FileOutput,
  BookOpen,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Target,
  Info,
  Shield,
  MessageSquare,
  FileOutput,
  BookOpen,
};

interface BlockLibraryItemProps {
  config: BlockTypeConfig;
}

function BlockLibraryItem({ config }: BlockLibraryItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${config.type}`,
    data: {
      type: 'block-type',
      blockType: config.type,
    },
  });

  const Icon = iconMap[config.icon];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 mb-2 bg-white border border-gray-200 rounded-lg
        cursor-grab hover:border-blue-400 hover:shadow-sm transition-all
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <div className={`w-8 h-8 rounded-md ${config.color} flex items-center justify-center`}>
        {Icon && <Icon className="w-4 h-4 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{config.label}</div>
        <div className="text-xs text-gray-500 truncate">{config.description}</div>
      </div>
    </div>
  );
}

interface BlockLibraryProps {
  onBlockClick?: (type: BlockType) => void;
}

export function BlockLibrary({ onBlockClick }: BlockLibraryProps) {
  const blockTypes = Object.values(BLOCK_TYPE_REGISTRY);

  return (
    <div className="h-full flex flex-col bg-gray-50 border-l border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Block Library</h2>
        <p className="text-sm text-gray-500 mt-1">
          Drag blocks to the canvas or click to add
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {blockTypes.map((config) => (
            <div
              key={config.type}
              onClick={() => onBlockClick?.(config.type)}
              className="cursor-pointer"
            >
              <BlockLibraryItem config={config} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-100">
        <p className="text-xs text-gray-500">
          Tip: You can also click any block to add it directly
        </p>
      </div>
    </div>
  );
}