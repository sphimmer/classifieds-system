import { IUserService } from "../interfaces/IUserService";
import Container, { Service } from "typedi";
import { Connection, Repository } from "typeorm";

import { IUser } from "../interfaces/IUser";
import { IUserRequest } from "../interfaces/IUserRequest";
import { ILoginRequest } from "../interfaces/ILoginRequest";
import { hashPassword } from "../util/password";

import { ILoginResult } from "../interfaces/ILoginResult";
import { createJWT } from "../util/jwt";
import { User } from "../models/entities/User";
import { AuthenticationError } from "../errors/AuthenticationError";
import { BadRequestError } from "../errors/BadRequestError";
import { InternalServerError } from "../errors/InternalServerError";



/**
 * @inheritdoc
 */
@Service()
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

    async setRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
        const rt = await hashPassword(refreshToken)
        const dt1 = new Date();
        const dt2 = new Date(dt1);
        dt1.setMinutes(dt2.getMinutes() + 10);
        const response = await this.repo.update({id: userId}, {refreshToken: rt, refreshTokenExpiration: dt1});
        return response.affected == 1;

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
                throw new BadRequestError("Account already exists with this email. Please login to access your account.")
            } else {
                console.error(error);
                throw new InternalServerError("Something wrong happened. We are on it.")
            }
        }
    }
}