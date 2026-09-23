import { Plus, Trash2 } from 'lucide-react';
import StringListEditor from './StringListEditor';

export type EditSubcategory = { subName: string; description: string; items: string[] };
export type EditCategory = { category: string; description: string; subcategories: EditSubcategory[] };

function emptySubcategory(): EditSubcategory {
  return { subName: '', description: '', items: [] };
}
function emptyCategory(): EditCategory {
  return { category: '', description: '', subcategories: [] };
}

export default function ProductsEditor({
  categories,
  onChange,
}: {
  categories: EditCategory[];
  onChange: (categories: EditCategory[]) => void;
}) {
  function updateCategory(i: number, patch: Partial<EditCategory>) {
    const next = [...categories];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function removeCategory(i: number) {
    onChange(categories.filter((_, idx) => idx !== i));
  }
  function addCategory() {
    onChange([...categories, emptyCategory()]);
  }

  function updateSubcategory(catIdx: number, subIdx: number, patch: Partial<EditSubcategory>) {
    const cat = categories[catIdx];
    const nextSubs = [...cat.subcategories];
    nextSubs[subIdx] = { ...nextSubs[subIdx], ...patch };
    updateCategory(catIdx, { subcategories: nextSubs });
  }
  function removeSubcategory(catIdx: number, subIdx: number) {
    const cat = categories[catIdx];
    updateCategory(catIdx, { subcategories: cat.subcategories.filter((_, i) => i !== subIdx) });
  }
  function addSubcategory(catIdx: number) {
    const cat = categories[catIdx];
    updateCategory(catIdx, { subcategories: [...cat.subcategories, emptySubcategory()] });
  }

  return (
    <div className="space-y-6">
      {categories.map((cat, catIdx) => (
        <div key={catIdx} className="border border-gray-200 rounded-xl p-5 bg-light-gray/40">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1 space-y-3">
              <input
                value={cat.category}
                onChange={(e) => updateCategory(catIdx, { category: e.target.value })}
                placeholder="Category name (e.g. Printing & Packaging)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold"
              />
              <textarea
                value={cat.description}
                onChange={(e) => updateCategory(catIdx, { description: e.target.value })}
                placeholder="Category description (optional)"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
              />
            </div>
            <button type="button" onClick={() => removeCategory(catIdx)} className="text-gray-400 hover:text-red-600 p-2" title="Remove category">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {cat.subcategories.map((sub, subIdx) => (
              <div key={subIdx} className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 space-y-2">
                    <input
                      value={sub.subName}
                      onChange={(e) => updateSubcategory(catIdx, subIdx, { subName: e.target.value })}
                      placeholder="Subcategory name (optional)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    <input
                      value={sub.description}
                      onChange={(e) => updateSubcategory(catIdx, subIdx, { description: e.target.value })}
                      placeholder="Subcategory description (optional)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubcategory(catIdx, subIdx)}
                    className="text-gray-400 hover:text-red-600 p-2"
                    title="Remove subcategory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <StringListEditor
                  label="Items"
                  items={sub.items}
                  onChange={(items) => updateSubcategory(catIdx, subIdx, { items })}
                  placeholder="e.g. Fountain Solution Concentrate"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addSubcategory(catIdx)}
              className="flex items-center gap-1 text-xs font-medium text-primary-blue hover:text-accent-hover"
            >
              <Plus className="w-3.5 h-3.5" /> Add subcategory
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCategory}
        className="flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-dashed border-primary-blue/40 rounded-xl px-4 py-3 w-full justify-center"
      >
        <Plus className="w-4 h-4" /> Add product category
      </button>
    </div>
  );
}
