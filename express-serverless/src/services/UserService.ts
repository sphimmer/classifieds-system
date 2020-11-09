import { IUserService } from "../interfaces/IUserService";
import Container, { Service } from "typedi";
import { Connection, Repository } from "typeorm";
import { IUser } from "../interfaces/IUser";
import { IUserRequest } from "../interfaces/IUserRequest";
import { User } from "../models/entities/User";
import { BadRequestError } from "../errors/BadRequestError";
import { InternalServerError } from "../errors/InternalServerError";
import { Location } from "../models/entities/Location";



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

    /**
     * @inheritdoc
     */
    async updateMe(data: IUser, userId: string): Promise<IUser> {

        await this.repo.update(userId, data);
        
        return await this.repo.findOne(userId);
    }

    /**
     * @inheritdoc
     */
    public async getUserById(id: string): Promise<IUser> {
        return await this.repo.findOne(id, { relations: ['location']});
    }

    public async findUserByCognitoIdAndEmail(cognitoId: string, email: string): Promise<User> {
        return await this.repo.findOne({ cognitoId: cognitoId, email: email });
    }

    /**
     * @inheritdoc
     */
    public async getMe(cognitoId: string): Promise<IUser> {
        return await this.repo.findOneOrFail({cognitoId: cognitoId});
    }

    /**
     * @inheritdoc
     */
    public async createUser(user: User): Promise<IUser> {
        try {
            return await this.repo.save(user);
        } catch (error) {
            if (error.name == "QueryFailedError" && error.code == "23505") {
                throw new BadRequestError("Account already exists with this email. Please login to access your account.")
            } else {
                console.error(error);
                throw new InternalServerError()
            }
        }
    }
}