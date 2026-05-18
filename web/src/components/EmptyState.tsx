const logoGrayUrl = new URL("../assets/logogray.svg", import.meta.url).href

interface Props {
  onCreate?: () => void
}

export function EmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div >
        <img src={logoGrayUrl} alt="Logo cinza" className="h-16 w-16" />
      </div>

      <p className="mt-6 max-w-md text-center text-slate-700">
        Você ainda não possui flashcards.
        <br /> Que tal criar um para começar?
      </p>

      <button
        onClick={() => onCreate?.()}
        className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-violet-500"
      >
        Novo Flashcard
      </button>
    </div>
  )
}

export default EmptyState
