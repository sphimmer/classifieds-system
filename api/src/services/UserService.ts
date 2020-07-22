import { IUserService } from "../interfaces/IUserService";
import Container from "typedi";
import { Connection, Repository } from "typeorm";
import { User } from "../models/entities/User";
import { IUser } from "../interfaces/IUser";
import { IUserRequest } from "../interfaces/IUserRequest";
import { ILoginRequest } from "../interfaces/ILoginRequest";
import { hashPassword } from "../util/password";
import { AuthenticationError, UserInputError, ApolloError } from "apollo-server-koa";
import { ILoginResult } from "../interfaces/ILoginResult";
import { createJWT } from "../util/jwt";
import { StatusEnum } from "../models/enums/StatusEnum";
import { ID } from "type-graphql";

/**
 * @inheritdoc
 */
export class UserService implements IUserService {
    connection: Connection;
    repo: Repository<User>;

    /**
     * @inheritdoc
     */
    public constructor() {
        this.connection = Container.get("connection");
        this.repo = this.connection.getRepository(User);
    }
    
    /**
     * @inheritdoc
     */
    async updateMe(data: IUserRequest, userId: string): Promise<IUser> {
        const user = data.toEntity();
        await this.repo.update(userId, data);
        return await this.repo.findOne(userId);
    }

    /**
     * @inheritdoc
     */
    public async login(data: ILoginRequest): Promise<IUser> {
        // find email
        const userResult = await this.repo.find({ where: { email: data.email } });
        if (userResult.length == 1) {
            const user = userResult[0]
            return user;
        } else {
            throw new AuthenticationError("Invalid Credentials. Please try again.");
        }
    }

    /**
     * @inheritdoc
     */
    public async getUserById(id: string): Promise<IUser> {
        return await this.repo.findOne(id, { relations: ['location', 'listings'] });
    }

    /**
     * @inheritdoc
     */
    public async getMe(): Promise<IUser> {
        throw new Error("not implemented");
    }

    /**
     * @inheritdoc
     */
    public async createUser(data: IUserRequest): Promise<IUser> {
        const user = data.toEntity();
        user.password = await hashPassword(user.password)
        try {
            return await this.repo.save(user);
        } catch (error) {
            if (error.name == "QueryFailedError" && error.code == "23505") {
                throw new UserInputError("Account already exists with this email. Please login to access your account.")
            } else {
                console.error(error);
                throw new ApolloError("Something wrong happened. We are on it.")
            }
        }
    }
}