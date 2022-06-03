import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { ListAvailableCarController } from "@modules/cars/useCases/listAvailableCar/ListAvailableCarController";
import { Router } from "express";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarController = new ListAvailableCarController();

carsRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createCarController.handle
);

carsRoutes.get(
    '/available',
    listAvailableCarController.handle
)

export { carsRoutes }