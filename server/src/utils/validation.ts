import { Category } from '../types';

const VALID_CATEGORIES: Category[] = ['JavaScript', 'React', 'Tailwind CSS', 'Node.js'];

export function isValidCategory(category: unknown): category is Category {
  return typeof category === 'string' && VALID_CATEGORIES.includes(category as Category);
}

export function validateFlashcardInput(data: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, error: 'Invalid input format' };
  }

  const input = data as Record<string, unknown>;

  // Check required fields
  if (!input.question || typeof input.question !== 'string' || input.question.trim() === '') {
    return { valid: false, error: 'Question is required and must be a non-empty string' };
  }

  if (!input.answer || typeof input.answer !== 'string' || input.answer.trim() === '') {
    return { valid: false, error: 'Answer is required and must be a non-empty string' };
  }

  if (!input.category) {
    return { valid: false, error: 'Category is required' };
  }

  if (!isValidCategory(input.category)) {
    return {
      valid: false,
      error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
    };
  }

  return { valid: true };
}

export function getValidCategories(): Category[] {
  return VALID_CATEGORIES;
}
