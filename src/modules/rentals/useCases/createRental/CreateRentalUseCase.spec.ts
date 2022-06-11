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
        const car = await carsRepositoryInMemory.create({
            name: "test car1",
            description: "test car description1",
            daily_rate: 100,
            license_plate: "ABC-12341",
            fine_amount: 10,
            category_id: "12341",
            brand: "brand1",
        })

        const rental = await createRentalUseCase.execute({
            user_id: "123456",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty('id');
        expect(rental).toHaveProperty('start_date');
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "test car2",
            description: "test car description2",
            daily_rate: 100,
            license_plate: "ABC-12342",
            fine_amount: 10,
            category_id: "12342",
            brand: "brand2",
        });

        await createRentalUseCase.execute({
            user_id: "123456",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });


        await expect(createRentalUseCase.execute({
                user_id: "123456",
                car_id: '654321',
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError('User already has a rental open'));
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "test car3",
            description: "test car description3",
            daily_rate: 100,
            license_plate: "ABC-12343",
            fine_amount: 10,
            category_id: "12343",
            brand: "brand3",
        });
        await createRentalUseCase.execute({
            user_id: "123456",
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        await expect(createRentalUseCase.execute({
                user_id: "654321",
                car_id: car.id,
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError('Car already rented'));
    });

    it("should not be able to create a new rental with invalid return type", async () => {
        await expect(createRentalUseCase.execute({
                user_id: "654321",
                car_id: '123456',
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError('Invalid return time!'));
    });
});