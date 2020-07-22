import { AccountService } from "api/AccountService";
import { CategoryService } from "api/CategoryService";

export interface IAccountProps {
    accountService: AccountService;
    categoryService: CategoryService;
}