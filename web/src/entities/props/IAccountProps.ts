import { AccountService } from "api/AccountService";
import { CategoryService } from "api/CategoryService";
import { ILocalStorage } from "entities/ILocalStorage";

export interface IAccountProps {
    accountService: AccountService;
    categoryService: CategoryService;
    session: ILocalStorage;
}