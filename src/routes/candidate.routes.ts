import { NextFunction, Request, Response, Router } from "express";
import { getMe, loginUser, registerUser } from "../controllers/candidate.controllers";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password } = await req.body;
    await registerUser(
        {fullName, email, password},
        next,
        res
    );
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = await req.body;
    await loginUser(
        { email, password},
        next,
        res
    );
});
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    await getMe(
        next,
        res,
        req
    );
});

export default router;