import { useEffect, useState, type FormEvent } from "react"
import type { Flashcard } from "../types/flashcard"

const fileIconUrl = new URL("../assets/file.svg", import.meta.url).href
const questionIconUrl = new URL("../assets/question.svg", import.meta.url).href
const linesIconUrl = new URL("../assets/lines.svg", import.meta.url).href

interface Props {
  onSubmit: (data: {
    question: string
    answer: string
    category: string
  }) => Promise<void>
  onClose?: () => void
  editingCard?: Flashcard | null
}

const availableCategories = [
  "JavaScript",
  "React",
  "Tailwind CSS",
  "Node.js",
]

export function FlashCardForm({ onSubmit, onClose, editingCard }: Props) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [category, setCategory] = useState("")
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({})

  useEffect(() => {
    if (editingCard) {
      setQuestion(editingCard.question)
      setAnswer(editingCard.answer)
      setCategory(editingCard.category)
      setErrors({})
      return
    }

    setQuestion("")
    setAnswer("")
    setCategory("")
    setErrors({})
  }, [editingCard])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const trimmedQuestion = question.trim()
    const trimmedAnswer = answer.trim()
    const newErrors: { question?: string; answer?: string } = {}

    if (!trimmedQuestion) {
      newErrors.question = "A pergunta é obrigatória."
    }

    if (!trimmedAnswer) {
      newErrors.answer = "A resposta é obrigatória."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    await onSubmit({ question: trimmedQuestion, answer: trimmedAnswer, category })

    setQuestion("")
    setAnswer("")
    setCategory("")
    setErrors({})
  }

  const categoryOptions = Array.from(
    new Set([
      ...(category && !availableCategories.includes(category)
        ? [category]
        : []),
      ...availableCategories,
    ])
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Categoria</span>
            <div className="relative">
              <img
                src={fileIconUrl}
                alt="Icone de categoria"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 opacity-70"
              />
              <select
                required
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 pl-12 text-slate-900 outline-none transition focus:border-violet-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Selecione a categoria do card</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Pergunta</span>
            <div className="relative">
              <img
                src={questionIconUrl}
                alt="Icone de pergunta"
                className="pointer-events-none absolute left-4 top-4 h-5 w-5 opacity-70"
              />
              <textarea
                rows={3}
                className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 pt-4 pl-12 text-slate-900 outline-none transition focus:border-violet-500"
                placeholder="Ex: O que é uma Closure no JavaScript?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            {errors.question ? (
              <p className="mt-2 text-sm text-red-600">{errors.question}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Resposta</span>
            <div className="relative">
              <img
                src={linesIconUrl}
                alt="Icone de resposta"
                className="pointer-events-none absolute left-4 top-4 h-5 w-5 opacity-70"
              />
              <textarea
                rows={4}
                className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 pt-4 pl-12 text-slate-900 outline-none transition focus:border-violet-500"
                placeholder="Ex: Uma closure é a combinação de uma função com o ambiente léxico..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            {errors.answer ? (
              <p className="mt-2 text-sm text-red-600">{errors.answer}</p>
            ) : null}
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="min-w-[140px] rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
        ) : null}

        <button
          type="submit"
          className="min-w-[180px] rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500"
        >
          {editingCard ? "Salvar alterações" : "Salvar flashcard"}
        </button>
      </div>
    </form>
  )
}
