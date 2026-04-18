import { useDraggable } from '@dnd-kit/core';
import { BLOCK_TYPES } from '@/types/blocks';
import type { BlockType } from '@/types/blocks';

function DraggableBlock({ meta }: { meta: (typeof BLOCK_TYPES)[number] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${meta.type}`,
    data: { fromLibrary: true, blockType: meta.type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow cursor-grab select-none ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
      }`}
    >
      <div className={`h-3 w-3 rounded-full ${meta.color}`} />
      <div>
        <div className="text-sm font-medium text-gray-900">{meta.label}</div>
        <div className="text-xs text-gray-500">{meta.description}</div>
      </div>
    </div>
  );
}

export default function BlockLibrary() {
  return (
    <div className="flex h-full w-64 flex-col gap-2 overflow-y-auto border-l border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Block Library
      </h2>
      {BLOCK_TYPES.map((meta) => (
        <DraggableBlock key={meta.type} meta={meta} />
      ))}
    </div>
  );
}

export { type BlockType };
