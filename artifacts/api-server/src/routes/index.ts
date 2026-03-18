import { Router, type IRouter } from "express";
import healthRouter from "./health";
import alunosRouter from "./alunos";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/alunos", alunosRouter);

export default router;
