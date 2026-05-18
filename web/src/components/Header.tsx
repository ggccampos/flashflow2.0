import { Plus } from "lucide-react"

interface HeaderProps {
  onCreate?: () => void
}

const logoUrl = new URL("../assets/logo.svg", import.meta.url).href

export function Header({ onCreate }: HeaderProps) {
  return (
    <header className="w-full bg-[#F7F9FB]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm">
            <img src={logoUrl} alt="Flash Flow logo" className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-950">Flash Flow</h1>
          </div>
        </div>

        <button
          onClick={() => onCreate?.()}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-violet-500"
        >
          <Plus size={14} />
          Novo Flashcard
        </button>
      </div>
    </header>
  )
}
