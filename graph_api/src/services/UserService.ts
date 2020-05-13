import { IUserService } from "../interfaces/IUserService";
import Container from "typedi";
import { Connection, Repository } from "typeorm";
import { User } from "../models/entities/User";
import { IUser } from "../interfaces/IUser";
import { IUserRequest } from "../interfaces/IUserRequest";

/**
 * @inheritdoc
 */
export class UserService implements IUserService{
    connection: Connection;
    repo: Repository<User>;

    /**
     * @inheritdoc
     */
    public constructor(){
        this.connection = Container.get("connection");
        this.repo = this.connection.getRepository(User);
    }

    /**
     * @inheritdoc
     */
    public async getUserById(id: string): Promise<IUser> {
        return await this.repo.findOne(id, {relations: ['location', 'listings']});
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
        console.log(user);
        return await this.repo.save(user);
    }
}