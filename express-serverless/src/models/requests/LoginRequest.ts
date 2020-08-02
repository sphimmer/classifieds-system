import { ILoginRequest } from "../../interfaces/ILoginRequest";

/**
 * @inheritdoc
 */
export class LoginRequest implements ILoginRequest {
    email: string;
    password: string;
}