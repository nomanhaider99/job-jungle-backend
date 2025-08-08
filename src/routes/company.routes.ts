import { NextFunction, Request, Response, Router } from "express";
import { getLoggedInCompany, loginCompany, registerCompany } from "../controllers/company.controllers";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { companyName, email, password } = await req.body;
    await registerCompany(
        {companyName, email, password},
        next,
        res
    );
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = await req.body;
    await loginCompany(
        { email, password},
        next,
        res
    );
});
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    await getLoggedInCompany(
        next,
        res,
        req
    );
});

export default router;