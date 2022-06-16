import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordEmailUseCase } from "./SendForgotPasswordEmailUseCase";

let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory;
        dateProvider = new DayjsDateProvider;
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory;
        mailProvider = new MailProviderInMemory;
        sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider,
            mailProvider
        );
    });

    it("should be able to send a forgot password mail to user", async () => {
        const sendMail = jest.spyOn(mailProvider, "sendMail");
        
        await usersRepositoryInMemory.create({
            driver_license: "7846589",
            email: "teste@teste.com",
            name: "Teste",
            password: "123456",
        });

        await sendForgotPasswordEmailUseCase.execute("teste@teste.com");

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to send a forgot password mail if user not exists", async () => {
        await expect(
            sendForgotPasswordEmailUseCase.execute("aaaa@aaaa.aaa")
        ).rejects.toEqual(new AppError("User does not exists"));
    });

    it("should be able to create an users token", async () => {
        const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create");

        await usersRepositoryInMemory.create({
            driver_license: "749874984",
            email: "test@test.com",
            name: "Test",
            password: "123456",
        });

        await sendForgotPasswordEmailUseCase.execute("test@test.com")

        expect(generateTokenMail).toBeCalled();
    });

});