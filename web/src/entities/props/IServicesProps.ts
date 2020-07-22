import { AccountService } from "api/AccountService";
import { CategoryService } from "api/CategoryService";

export interface IServicesProps{
    accountService: AccountService;
    categoryService: CategoryService;
}