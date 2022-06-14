import { SendForgotPasswordEmailController } from "@modules/accounts/useCases/sendForgotPasswordEmail/SendForgotPasswordEmailController";
import { Router } from "express";

const passwordsRoutes = Router();

const sendForgotPasswordEmailController = new SendForgotPasswordEmailController();

passwordsRoutes.post('/forgot', sendForgotPasswordEmailController.handle)

export { passwordsRoutes };