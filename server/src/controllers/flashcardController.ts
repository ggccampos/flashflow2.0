import { Request, Response, NextFunction } from 'express';
import prisma from '../db/database';
import { Flashcard, CreateFlashcardDTO, UpdateFlashcardDTO } from '../types';
import { generateId } from '../utils/idGenerator';
import { validateFlashcardInput, isValidCategory } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';

export class FlashcardController {
  // Create a new flashcard
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validateFlashcardInput(req.body);
      if (!validation.valid) {
        throw new AppError(validation.error!, 400);
      }

      const { question, answer, category } = req.body as CreateFlashcardDTO;
      const id = generateId();
      const created_at = new Date();

      const flashcard = await prisma.flashcard.create({
        data: {
          id,
          question: question.trim(),
          answer: answer.trim(),
          category,
          created_at,
        },
      });

      res.status(201).json(flashcard);
    } catch (error) {
      next(error);
    }
  }

  // Get all flashcards
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;

      const where = category
        ? { category: isValidCategory(category) ? category : undefined }
        : undefined;

      if (category && !isValidCategory(category)) {
        throw new AppError('Invalid category filter', 400);
      }

      const flashcards = await prisma.flashcard.findMany({
        where,
        orderBy: { created_at: 'desc' },
      });

      res.json(flashcards);
    } catch (error) {
      next(error);
    }
  }

  // Get a flashcard by ID
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const flashcard = await prisma.flashcard.findUnique({
        where: { id },
      });

      if (!flashcard) {
        throw new AppError('Flashcard not found', 404);
      }

      res.json(flashcard);
    } catch (error) {
      next(error);
    }
  }

  // Update a flashcard
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body as UpdateFlashcardDTO;

      const existing = await prisma.flashcard.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new AppError('Flashcard not found', 404);
      }

      if (
        data.question !== undefined &&
        (!data.question || typeof data.question !== 'string' || data.question.trim() === '')
      ) {
        throw new AppError('Question must be a non-empty string', 400);
      }

      if (
        data.answer !== undefined &&
        (!data.answer || typeof data.answer !== 'string' || data.answer.trim() === '')
      ) {
        throw new AppError('Answer must be a non-empty string', 400);
      }

      if (data.category !== undefined && !isValidCategory(data.category)) {
        throw new AppError('Invalid category', 400);
      }

      const updateData: Record<string, unknown> = {};

      if (data.question !== undefined) {
        updateData.question = data.question.trim();
      }

      if (data.answer !== undefined) {
        updateData.answer = data.answer.trim();
      }

      if (data.category !== undefined) {
        updateData.category = data.category;
      }

      if (Object.keys(updateData).length === 0) {
        throw new AppError('At least one field must be provided for update', 400);
      }

      const updated = await prisma.flashcard.update({
        where: { id },
        data: updateData,
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  // Delete a flashcard
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existing = await prisma.flashcard.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new AppError('Flashcard not found', 404);
      }

      await prisma.flashcard.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
