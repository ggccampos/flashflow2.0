import { Router } from 'express';
import { FlashcardController } from '../controllers/flashcardController';

const router = Router();

router.post('/', FlashcardController.create);
router.get('/', FlashcardController.getAll);
router.get('/:id', FlashcardController.getById);
router.put('/:id', FlashcardController.update);
router.delete('/:id', FlashcardController.delete);

export default router;
