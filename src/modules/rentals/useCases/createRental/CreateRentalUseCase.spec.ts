import dayjs from 'dayjs';
import { AppError } from "@shared/errors/AppError";
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        carsRepositoryInMemory = new CarsRepositoryInMemory();

        dayjsProvider = new DayjsDateProvider();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsProvider,
            carsRepositoryInMemory
        );
    });

    it("should be able to create a new rental", async () => {
        const rental = await createRentalUseCase.execute({
            user_id: "123456",
            car_id: '123456',
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        expect(async ()  => {
            await createRentalUseCase.execute({
                user_id: "123456",
                car_id: '123456',
                expected_return_date: dayAdd24Hours,
            });
    
            await createRentalUseCase.execute({
                user_id: "123456",
                car_id: '654321',
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toBeInstanceOf(AppError)
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        expect(async ()  => {
            await createRentalUseCase.execute({
                user_id: "123456",
                car_id: '123456',
                expected_return_date: dayAdd24Hours,
            });
    
            await createRentalUseCase.execute({
                user_id: "654321",
                car_id: '123456',
                expected_return_date: dayAdd24Hours,
            });
        }).rejects.toBeInstanceOf(AppError)
    });

    it("should not be able to create a new rental with invalid return tipe", async () => {
        expect(async ()  => {
            await createRentalUseCase.execute({
                user_id: "654321",
                car_id: '123456',
                expected_return_date: dayjs().toDate(),
            });
        }).rejects.toBeInstanceOf(AppError)
    });
});