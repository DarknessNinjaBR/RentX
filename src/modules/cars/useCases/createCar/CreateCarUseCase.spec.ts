import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    })

    it("should be able to create a car", async () => {
        const car = await createCarUseCase.execute({
            name: "Uno",
            description: "Melhor carro",
            daily_rate: 100,
            license_plate: "ABC123",
            fine_amount: 10,
            brand: "Fiat",
            category_id: "category",
        });

        expect(car).toHaveProperty("id");
    });

    it("should not be able to create a car with existing license plate", async () => {
        await createCarUseCase.execute({
            name: "Uno",
            description: "Melhor carro",
            daily_rate: 100,
            license_plate: "ABC123",
            fine_amount: 10,
            brand: "Fiat",
            category_id: "category",
        });
        await expect(createCarUseCase.execute({
                name: "Palop",
                description: "Quase carro",
                daily_rate: 100,
                license_plate: "ABC123",
                fine_amount: 10,
                brand: "Fiat",
                category_id: "category",
            })
        ).rejects.toEqual(new AppError("Car already exists"));
    });

    it("should be able to create a car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Uno Available",
            description: "Melhor carro",
            daily_rate: 100,
            license_plate: "ABC234",
            fine_amount: 10,
            brand: "Fiat",
            category_id: "category",
        });

        expect(car.available).toBe(true);
    });
})