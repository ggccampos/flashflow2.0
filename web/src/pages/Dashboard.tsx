import { useEffect, useState } from "react"

import { FlashCard } from "../components/Flashcard"
import { FlashCardForm } from "../components/FlashcardForm"
import { Header } from "../components/Header"
import CategoryFilter from "../components/CategoryFilter"
import EmptyState from "../components/EmptyState"

import { api } from "../service/api"
import type { Flashcard } from "../types/flashcard"

const addIconUrl = new URL("../assets/add.svg", import.meta.url).href

export function Dashboard() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)
  const [filter, setFilter] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null)

const [isLoaded, setIsLoaded] = useState(false)

useEffect(() => {
  async function fetchCards() {
    try {
      const response = await api.get<Flashcard[]>("/flashcards")
      setCards(response.data)
    } catch (error) {
      const stored = localStorage.getItem("flashflow:cards")
      if (stored) setCards(JSON.parse(stored))
      console.error("Erro ao carregar cards do backend:", error)
    } finally {
      setIsLoaded(true)
    }
  }
  fetchCards()
}, [])

// Só salva no localStorage após os dados terem sido carregados
useEffect(() => {
  if (isLoaded) {
    localStorage.setItem("flashflow:cards", JSON.stringify(cards))
  }
}, [cards, isLoaded])

  function openCreateForm() {
    setEditingCard(null)
    setIsFormOpen(true)
  }

  function openEditForm(card: Flashcard) {
    setEditingCard(card)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingCard(null)
  }

  async function createCard(data: {
    question: string
    answer: string
    category: string
  }) {
    if (editingCard) {
      try {
        const response = await api.put<Flashcard>(`/flashcards/${editingCard.id}`, data)

        setCards((prev) =>
          prev.map((card) =>
            card.id === editingCard.id ? { ...card, ...response.data } : card
          )
        )
      } catch (error) {
        console.error("Erro ao atualizar card:", error)
        setCards((prev) =>
          prev.map((card) =>
            card.id === editingCard.id ? { ...card, ...data } : card
          )
        )
      }

      setEditingCard(null)
      setIsFormOpen(false)
      return
    }

    try {
      const response = await api.post<Flashcard>("/flashcards", data)
      setCards((prev) => [response.data, ...prev])
    } catch (error) {
      console.error("Erro ao criar card:", error)
      const newCard: Flashcard = {
        id: crypto.randomUUID(),
        ...data,
      }
      setCards((prev) => [newCard, ...prev])
    }

    setIsFormOpen(false)
  }

  function requestDeleteCard(card: Flashcard) {
    setCardToDelete(card)
  }

  function deleteCard(id: string) {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }

  async function confirmDeleteCard() {
    if (!cardToDelete) return
    try {
      await api.delete(`/flashcards/${cardToDelete.id}`)
    } catch (error) {
      console.error("Erro ao deletar card:", error)
    }
    deleteCard(cardToDelete.id)
    setCardToDelete(null)
  }

  function cancelDeleteCard() {
    setCardToDelete(null)
  }

  const filteredCards = cards.filter((card) => {
    if (!filter || filter === "Tudo") {
      return true
    }

    return card.category.toLowerCase().includes(filter.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-950">
      <Header onCreate={openCreateForm} />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
              Painel de Aprendizado
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950">
              Domine tecnologia com foco total.
            </h1>
            <p className="mt-4 text-slate-600">Organize e revise seus flashcards rapidamente.</p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="rounded-full bg-[#F0F4F7] p-3">
              <CategoryFilter
                categories={["Tudo", "JavaScript", "React", "Tailwind CSS", "Node.js"]}
                onSelect={(c) => setFilter(c)}
                selected={filter || "Tudo"}
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          {filteredCards.length === 0 && cards.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <EmptyState onCreate={openCreateForm} />
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredCards.map((card) => (
                <FlashCard
                  key={card.id}
                  flashcard={card}
                  onDeleteRequest={requestDeleteCard}
                  onEdit={openEditForm}
                />
              ))}

              {cards.length > 0 ? (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex h-[320px] w-[384px] flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-slate-300 bg-[#F0F4F7] px-6 text-center text-slate-700 transition hover:bg-[#E9EEF3]"
                >
                  <img src={addIconUrl} alt="Criar novo card" className="h-10 w-10" />
                  <div className="text-lg font-semibold">Criar novo card</div>
                  <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                    Adicione um novo desafio à sua biblioteca e mantenha o ritmo.
                  </p>
                </button>
              ) : null}
            </div>
          )}
        </div>

        {isFormOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
            <div className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white text-slate-900 shadow-2xl">
              <div className="border-b border-slate-200 px-8 py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">
                  {editingCard ? "Editar Flashcard" : "Criar Flashcard"}
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-950">
                  Organize seu conhecimento com precisão e clareza.
                </h2>
              </div>
              <div className="px-8 py-8">
                <FlashCardForm
                  onSubmit={createCard}
                  onClose={closeForm}
                  editingCard={editingCard}
                />
              </div>
            </div>
          </div>
        ) : null}

        {cardToDelete ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
            <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-white text-slate-900 shadow-2xl">
              <div className="px-8 py-8 text-center">
                <img
                  src={new URL("../assets/excluLogo.svg", import.meta.url).href}
                  alt="Exclusão"
                  className="mx-auto mb-6 h-12 w-12"
                />
                <h2 className="text-xl font-semibold text-slate-950">
                  Tem certeza que deseja excluir este card?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Esta ação não pode ser desfeita e o card será removido permanentemente da sua biblioteca.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={cancelDeleteCard}
                    className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteCard}
                    className="rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
