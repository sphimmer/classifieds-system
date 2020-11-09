import { IRefreshRequest } from "../../interfaces/IRefreshRequest";

/**
 * @inheritdoc
 */
export class RefreshRequest implements IRefreshRequest{
    refreshToken: string;
}