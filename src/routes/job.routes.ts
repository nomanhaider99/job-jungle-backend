import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    // logic here
});

router.get('/listings/:id', async (req: Request, res: Response, next: NextFunction) => {
    // logic here
});
router.get('/listings', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    // logic here
});
router.delete('/delete/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    // logic here
});

export default router;