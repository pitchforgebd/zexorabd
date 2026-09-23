import { Plus, X } from 'lucide-react';

export default function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  function updateAt(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }
  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...items, '']);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateAt(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <button type="button" onClick={() => removeAt(i)} className="text-gray-400 hover:text-red-600 px-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover"
      >
        <Plus className="w-3.5 h-3.5" /> Add item
      </button>
    </div>
  );
}
