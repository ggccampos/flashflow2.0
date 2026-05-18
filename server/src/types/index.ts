export type Category = 'JavaScript' | 'React' | 'Tailwind CSS' | 'Node.js';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: Category;
  created_at: Date;
}

export interface CreateFlashcardDTO {
  question: string;
  answer: string;
  category: Category;
}

export interface UpdateFlashcardDTO {
  question?: string;
  answer?: string;
  category?: Category;
}
