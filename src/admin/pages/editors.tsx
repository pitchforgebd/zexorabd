import { Plus, Trash2 } from 'lucide-react';
import { ICON_NAMES, getIcon } from '../../lib/icons';
import type { IconItem, TitledIconItem } from '../../lib/types';

/** Same shape as divisions/StringListEditor but with a textarea - built for
 * multi-sentence paragraph fields where a single-line input is unusable. */
export function ParagraphListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  function updateAt(i: number, value: string) {
    onChange(items.map((p, idx) => (idx === i ? value : p)));
  }
  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={p}
              onChange={(e) => updateAt(i, e.target.value)}
              rows={3}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y"
            />
            <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600 px-2 self-start">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ''])} className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover">
        <Plus className="w-3.5 h-3.5" /> Add paragraph
      </button>
    </div>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const Icon = getIcon(value);
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="px-2 py-2 rounded-lg border border-gray-200 text-sm">
        {ICON_NAMES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

/** For {name, icon}[] grids - division lists, industry lists. */
export function IconItemsEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: IconItem[];
  onChange: (items: IconItem[]) => void;
}) {
  function updateAt(i: number, patch: Partial<IconItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <IconPicker value={item.icon} onChange={(icon) => updateAt(i, { icon })} />
            <input
              value={item.name}
              onChange={(e) => updateAt(i, { name: e.target.value })}
              placeholder="Name"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600 px-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { name: '', icon: ICON_NAMES[0] }])}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover"
      >
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>
    </div>
  );
}

/** For {icon, title, desc}[] cards - core values, business models. */
export function TitledIconItemsEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: TitledIconItem[];
  onChange: (items: TitledIconItem[]) => void;
}) {
  function updateAt(i: number, patch: Partial<TitledIconItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="flex gap-2 items-center">
              <IconPicker value={item.icon} onChange={(icon) => updateAt(i, { icon })} />
              <input
                value={item.title}
                onChange={(e) => updateAt(i, { title: e.target.value })}
                placeholder="Title"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600 px-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={item.desc}
              onChange={(e) => updateAt(i, { desc: e.target.value })}
              placeholder="Description"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { icon: ICON_NAMES[0], title: '', desc: '' }])}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover"
      >
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>
    </div>
  );
}

/** For {title, desc}[] lists without an icon - "Why Choose Us" reasons. */
export function TitledItemsEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: { title: string; desc: string }[];
  onChange: (items: { title: string; desc: string }[]) => void;
}) {
  function updateAt(i: number, patch: Partial<{ title: string; desc: string }>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item.title}
              onChange={(e) => updateAt(i, { title: e.target.value })}
              placeholder="Title"
              className="w-1/3 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={item.desc}
              onChange={(e) => updateAt(i, { desc: e.target.value })}
              placeholder="Description"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600 px-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { title: '', desc: '' }])}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover"
      >
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>
    </div>
  );
}
