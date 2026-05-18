interface Props {
  categories: string[]
  selected?: string
  onSelect?: (cat: string) => void
}

export function CategoryFilter({ categories, selected = "Tudo", onSelect }: Props) {
  return (
    <div className="flex gap-2 items-center">
      {categories.map((cat) => {
        const active = cat === selected
        return (
          <button
            key={cat}
            onClick={() => onSelect?.(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              active
                ? "bg-[#F3E8FF] text-[#6D28D9]"
                : "bg-transparent text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
