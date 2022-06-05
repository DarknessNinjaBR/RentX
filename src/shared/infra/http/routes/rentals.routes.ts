import { CreateRentalController } from "@modules/rentals/useCases/CreateRentalController";
import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const rentalsRouter = Router();

const createRentalController = new CreateRentalController;

rentalsRouter.post(
    "/",
    ensureAuthenticated,
    createRentalController.handle
);


export { rentalsRouter }