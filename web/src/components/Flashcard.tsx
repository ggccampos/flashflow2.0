import { motion } from "framer-motion"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"

import type { Flashcard } from "../types/flashcard"

const turnButtonUrl = new URL("../assets/turnButton.svg", import.meta.url).href

interface Props {
  flashcard: Flashcard
  onDeleteRequest: (card: Flashcard) => void
  onEdit: (card: Flashcard) => void
}

export function FlashCard({ flashcard, onDeleteRequest, onEdit }: Props) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-[384px] h-[320px] cursor-pointer perspective-[1000px]"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-full w-full rounded-[28px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute right-6 top-6 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(flashcard)
              }}
              className="p-2 text-slate-700 transition hover:text-slate-950"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteRequest(flashcard)
              }}
              className="p-2 text-red-600 transition hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setFlipped(!flipped)
            }}
            className="absolute bottom-6 right-6 p-0 transition hover:bg-slate-100"
          >
            <img src={turnButtonUrl} alt="Virar card" className="h-[44px] w-[44px]" />
          </button>

          <span className="inline-flex w-max self-start items-center rounded-full bg-[#F0F4F7] px-3 py-1 text-xs font-semibold text-[#566166]">
            {flashcard.category}
          </span>

          <div className="flex flex-1 items-center justify-center">
            <h2 className="text-2xl font-bold text-slate-950 text-center">
              {flashcard.question}
            </h2>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex flex-col rounded-[28px] bg-white p-6 shadow-sm"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex w-max items-center rounded-full bg-[#F0F4F7] px-3 py-1 text-xs font-semibold text-[#566166]">
              {flashcard.category}
            </span>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(flashcard)
                }}
                className="rounded-full p-2 text-slate-700 transition "
                type="button"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteRequest(flashcard)
                }}
                className="rounded-full p-2 text-red-600 transition "
                type="button"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <p className="mb-2 text-center text-[12px] font-medium text-[#566166]">
              {flashcard.question}
            </p>

            <p className="text-center text-[14px] font-semibold text-[#7C3AED] leading-relaxed">
              {flashcard.answer}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setFlipped(!flipped)
            }}
            className="absolute bottom-6 right-6 p-0 transition hover:bg-slate-100"
          >
            <img src={turnButtonUrl} alt="Virar card" className="h-[44px] w-[44px]" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
