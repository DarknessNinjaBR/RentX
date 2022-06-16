import { ResetPasswordController } from "@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController";
import { SendForgotPasswordEmailController } from "@modules/accounts/useCases/sendForgotPasswordEmail/SendForgotPasswordEmailController";
import { Router } from "express";

const passwordsRoutes = Router();

const sendForgotPasswordEmailController = new SendForgotPasswordEmailController();
const resetPasswordController = new ResetPasswordController();

passwordsRoutes.post('/forgot', sendForgotPasswordEmailController.handle)

passwordsRoutes.post('/reset', resetPasswordController.handle)

export { passwordsRoutes };