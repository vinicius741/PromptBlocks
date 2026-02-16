import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { BLOCK_TYPES, type BlockType } from '@/types/blocks';

interface DraggableBlockProps {
  type: BlockType;
}

function DraggableBlock({ type }: DraggableBlockProps) {
  const blockMeta = BLOCK_TYPES.find((b) => b.type === type)!;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `library-${type}`,
    data: { type, isNew: true },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing`}
    >
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full bg-${blockMeta.color}`} />
        <span className="font-medium text-gray-800">{blockMeta.label}</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">{blockMeta.description}</p>
    </div>
  );
}

export function BlockLibrary() {
  return (
    <div className="h-full overflow-y-auto border-l border-gray-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Block Library</h2>
      <div className="space-y-2">
        {BLOCK_TYPES.map((blockType) => (
          <DraggableBlock key={blockType.type} type={blockType.type} />
        ))}
      </div>
    </div>
  );
}
