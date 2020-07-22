
import { IUser } from "entities/IUser";
import { APIService } from "./APIService";
import { saveUser, getUser } from "util/session";
import { ILocalStorage } from "entities/ILocalStorage";
import { UpdateUserRequest } from "entities/requests/UpdateUserRequest";
require('dotenv').config()


export class AccountService extends APIService {
    constructor() {
        super();
    }
    public async createAccount(user: IUser): Promise<boolean> {

        const body = {
            query: `
              mutation ($data: UserRequest! ) {
                createUser (
                  data: $data
                ) {
                  jwt
                  message
                  user{
                      id
                      email
                      firstName
                      lastName
                  }
                }
              }
            `,
            variables: {
                data: user
            }
        }

        // console.log(process.env)
        const response = await this.apiClient.post('/graphql', body);
        // check status and message or for errors
        if (response.data.hasOwnProperty('errors')) {
            throw new Error(response.data.errors[0].extensions.code + ': ' + response.data.errors[0].message);
        }

        saveUser({ jwt: response.data.data.createUser.jwt, user: response.data.data.createUser.user })

        return true;

    }

    public async login(user: IUser): Promise<boolean> {
        const body = {
            query: `
              mutation ($data: LoginRequest! ) {
                login (
                  data: $data
                ) {
                  jwt
                  message
                  user{
                      id
                      email
                      firstName
                      lastName
                  }
                }
              }
            `,
            variables: {
                data: { email: user.email, password: user.password }
            }
        }
        const response = await this.apiClient.post('/graphql', body);

        if (response.data.hasOwnProperty('errors')) {
            throw new Error(response.data.errors[0].extensions.code + ': ' + response.data.errors[0].message);
        }

        saveUser({ jwt: response.data.data.login.jwt, user: response.data.data.login.user })

        return true;

    }

    public async getFullProfile(user: ILocalStorage) {
        const savedSession = user;
        const body = {
            query: `
                {
                    me{
                        id
                        email
                        firstName
                        lastName
                        phoneNumber
                        location{
                            id
                            city
                            state
                            zip
                        }
                        dateCreated
                        accountType
                        listings{
                            id
                        }
                    }
                }
            `
        }

        const response = await this.apiClient.post('/graphql', body, {headers: {'Authorization': 'Bearer ' + savedSession!  .jwt}});
        if (response.data.hasOwnProperty('errors')) {
            throw new Error(response.data.errors[0].extensions.code + ': ' + response.data.errors[0].message);
        }
        console.log(response);
        return response.data.data.me as IUser;
    }

    public async updateMe(user: IUser): Promise<IUser>{
        const updateUserRequest = new UpdateUserRequest(user);
        const savedSession = getUser();
        const body = {
            query: `
            mutation($data: UserRequest!){
                updateMe(data: $data) {
                  id
                  firstName
                  lastName
                  email
                  location{
                    id
                    city
                    zip
                    state
                  }
                }
              }`,
              variables: {
                  data: updateUserRequest
              }
            };

        const response = await this.apiClient.post('/graphql', body, {headers: {'Authorization': 'Bearer ' + savedSession!.jwt}});
        if (response.data.hasOwnProperty('errors')) {
            throw new Error(response.data.errors[0].extensions.code + ': ' + response.data.errors[0].message);
        }
        console.log(response);
        return response.data.data.updateMe as IUser;
    }
}