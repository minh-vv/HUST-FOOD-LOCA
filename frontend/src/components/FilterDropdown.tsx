import { useState } from "react";


type FilterDropdownProps = {
  onClose: () => void;
  onApply: (filters: {
    flavorIds: number[];
    ingredientIds: number[];
  }) => void;
};

export default function FilterDropdown({
  onClose,
  onApply,
}: FilterDropdownProps) {

  const [flavors, setFlavors] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cookTime, setCookTime] = useState<string[]>([]);

  const toggle = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(
      list.includes(value)
        ? list.filter(v => v !== value)
        : [...list, value]
    );
  };
  const FLAVOR_MAP: Record<string, number> = {
  "酸っぱい": 1,
  "辛い": 2,
  "甘い": 3,
  "塩辛い": 4,
  };

  const INGREDIENT_MAP: Record<string, number> = {
    "フォー": 1,
    "パン": 2,
    "牛肉": 3,
    "エビ": 4,
    "鶏肉": 5,
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-xl z-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">フィルター条件</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>
      </div>

      {/* Flavor */}
      <Section title="味">
        {["酸っぱい", "辛い", "甘い", "塩辛い"].map(v => (
          <Checkbox
            key={v}
            label={v}
            checked={flavors.includes(v)}
            onChange={() => toggle(v, flavors, setFlavors)}
          />
        ))}
      </Section>

      {/* Ingredient */}
      <Section title="材料">
        {["フォー", "パン", "牛肉", "エビ", "鶏肉"].map(v => (
          <Checkbox
            key={v}
            label={v}
            checked={ingredients.includes(v)}
            onChange={() => toggle(v, ingredients, setIngredients)}
          />
        ))}
      </Section>

      {/* Cook time */}
      <Section title="調理時間">
        {["〜10分", "10〜20分", "20分以上"].map(v => (
          <Checkbox
            key={v}
            label={v}
            checked={cookTime.includes(v)}
            onChange={() => toggle(v, cookTime, setCookTime)}
          />
        ))}
      </Section>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => {
            setFlavors([]);
            setIngredients([]);
            setCookTime([]);
          }}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          リセット
        </button>

        <button
  onClick={() => {
    const flavorIds = flavors.map(f => FLAVOR_MAP[f]).filter(Boolean);
    const ingredientIds = ingredients.map(i => INGREDIENT_MAP[i]).filter(Boolean);

    onApply({
      flavorIds,
      ingredientIds,
    });

    onClose();
  }}
  className="px-4 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
>
  適用
</button>



      </div>
    </div>
  );
}

/* -------- sub components -------- */

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-orange-500"
      />
      {label}
    </label>
  );
}

type SectionProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-3">
      <p className="font-semibold text-sm mb-1">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {children}
      </div>
    </div>
  );
}

