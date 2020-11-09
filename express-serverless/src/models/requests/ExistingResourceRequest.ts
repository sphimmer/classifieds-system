import { IExistingResourceRequest } from "../../interfaces/IExistingResourceRequest";
import { IsUUID, validate } from "class-validator";


/**
 * @inheritdoc
 */
export class ExistingResourceRequest implements IExistingResourceRequest{
    /**
     * @inheritdoc
     */
    @IsUUID()
    id: string;

    constructor(id: string){
        this.id = id;
    }
}