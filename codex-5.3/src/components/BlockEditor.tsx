import type { ReactNode } from 'react'
import { createExamplePair, outputFormatLabel } from '../lib/blocks'
import type { BlockInstance } from '../types/blocks'

interface BlockEditorProps {
  block: BlockInstance | null
  onChange: (block: BlockInstance) => void
}

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  if (!block) {
    return (
      <section className="h-full rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold text-slate-900">Block Editor</h2>
        <p className="mt-2 text-sm text-slate-600">
          Select a block on the canvas to edit its content.
        </p>
      </section>
    )
  }

  if (block.type === 'role') {
    return (
      <EditorShell title="Role Block">
        <FieldLabel htmlFor="role-input">Role</FieldLabel>
        <textarea
          id="role-input"
          className={textareaClass}
          onChange={(event) =>
            onChange({ ...block, data: { role: event.target.value } })
          }
          placeholder="e.g. senior product strategist"
          rows={4}
          value={block.data.role}
        />
      </EditorShell>
    )
  }

  if (block.type === 'task') {
    return (
      <EditorShell title="Task Block">
        <FieldLabel htmlFor="task-input">Task</FieldLabel>
        <textarea
          id="task-input"
          className={textareaClass}
          onChange={(event) =>
            onChange({ ...block, data: { task: event.target.value } })
          }
          placeholder="Describe exactly what the model should do."
          rows={5}
          value={block.data.task}
        />
      </EditorShell>
    )
  }

  if (block.type === 'context') {
    return (
      <EditorShell title="Context Block">
        <FieldLabel htmlFor="context-input">Context</FieldLabel>
        <textarea
          id="context-input"
          className={textareaClass}
          onChange={(event) =>
            onChange({ ...block, data: { context: event.target.value } })
          }
          placeholder="Relevant details, data, and constraints."
          rows={6}
          value={block.data.context}
        />
      </EditorShell>
    )
  }

  if (block.type === 'constraints') {
    const nonEmptyItems = block.data.items.length > 0 ? block.data.items : ['']
    return (
      <EditorShell title="Constraints Block">
        <div className="space-y-2">
          {nonEmptyItems.map((item, index) => (
            <div className="flex gap-2" key={`${block.id}-constraint-${index}`}>
              <input
                className={inputClass}
                onChange={(event) => {
                  const next = [...block.data.items]
                  next[index] = event.target.value
                  onChange({ ...block, data: { items: next } })
                }}
                placeholder={`Constraint ${index + 1}`}
                type="text"
                value={item}
              />
              <button
                className="rounded-md border border-rose-200 px-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                onClick={() => {
                  const next = block.data.items.filter(
                    (_, itemIndex) => itemIndex !== index,
                  )
                  onChange({
                    ...block,
                    data: { items: next.length > 0 ? next : [''] },
                  })
                }}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={() =>
            onChange({
              ...block,
              data: { items: [...block.data.items, ''] },
            })
          }
          type="button"
        >
          Add Constraint
        </button>
      </EditorShell>
    )
  }

  if (block.type === 'tone') {
    return (
      <EditorShell title="Tone Block">
        <FieldLabel htmlFor="tone-input">Tone</FieldLabel>
        <input
          className={inputClass}
          id="tone-input"
          onChange={(event) =>
            onChange({ ...block, data: { tone: event.target.value } })
          }
          placeholder="e.g. concise, analytical, and calm"
          type="text"
          value={block.data.tone}
        />
      </EditorShell>
    )
  }

  if (block.type === 'output_format') {
    return (
      <EditorShell title="Output Format Block">
        <FieldLabel htmlFor="output-format">Format</FieldLabel>
        <select
          className={inputClass}
          id="output-format"
          onChange={(event) =>
            onChange({
              ...block,
              data: {
                ...block.data,
                format: event.target.value as typeof block.data.format,
              },
            })
          }
          value={block.data.format}
        >
          <option value="plain_text">{outputFormatLabel('plain_text')}</option>
          <option value="bullet_list">
            {outputFormatLabel('bullet_list')}
          </option>
          <option value="json">{outputFormatLabel('json')}</option>
        </select>

        {block.data.format === 'json' ? (
          <>
            <FieldLabel htmlFor="json-schema">Optional JSON Schema</FieldLabel>
            <textarea
              className={textareaClass}
              id="json-schema"
              onChange={(event) =>
                onChange({
                  ...block,
                  data: { ...block.data, jsonSchema: event.target.value },
                })
              }
              placeholder='{"type":"object","properties":{"answer":{"type":"string"}}}'
              rows={8}
              value={block.data.jsonSchema}
            />
          </>
        ) : null}
      </EditorShell>
    )
  }

  return (
    <EditorShell title="Examples Block">
      <div className="space-y-3">
        {block.data.examples.map((example, index) => (
          <article
            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            key={example.id}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-700">
              Example {index + 1}
            </p>
            <FieldLabel htmlFor={`example-input-${example.id}`}>
              Input
            </FieldLabel>
            <textarea
              className={textareaClass}
              id={`example-input-${example.id}`}
              onChange={(event) => {
                const next = block.data.examples.map((item) =>
                  item.id === example.id
                    ? { ...item, input: event.target.value }
                    : item,
                )
                onChange({ ...block, data: { examples: next } })
              }}
              rows={3}
              value={example.input}
            />

            <FieldLabel htmlFor={`example-output-${example.id}`}>
              Output
            </FieldLabel>
            <textarea
              className={textareaClass}
              id={`example-output-${example.id}`}
              onChange={(event) => {
                const next = block.data.examples.map((item) =>
                  item.id === example.id
                    ? { ...item, output: event.target.value }
                    : item,
                )
                onChange({ ...block, data: { examples: next } })
              }}
              rows={3}
              value={example.output}
            />
            <button
              className="mt-2 rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              onClick={() => {
                const next = block.data.examples.filter(
                  (item) => item.id !== example.id,
                )
                onChange({ ...block, data: { examples: next } })
              }}
              type="button"
            >
              Remove Example
            </button>
          </article>
        ))}
      </div>

      <button
        className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        onClick={() =>
          onChange({
            ...block,
            data: {
              examples: [...block.data.examples, createExamplePair()],
            },
          })
        }
        type="button"
      >
        Add Example
      </button>
    </EditorShell>
  )
}

function EditorShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="h-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode
  htmlFor: string
}) {
  return (
    <label
      className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-300 transition focus:border-sky-400 focus:ring-2'

const textareaClass = `${inputClass} resize-y`
