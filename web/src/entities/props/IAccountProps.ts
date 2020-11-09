import { AccountService } from "api/AccountService";
import { CategoryService } from "api/CategoryService";
import { ILocalStorage } from "entities/ILocalStorage";
import { Location } from "history";

export interface IAccountProps {
    accountService: AccountService;
    categoryService: CategoryService;
    location: Location;
}