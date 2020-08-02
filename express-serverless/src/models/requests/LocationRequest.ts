import { ILocationRequest } from "../../interfaces/ILocationRequest";

/**
 * @inheritdoc
 */

export class LocationRequest implements ILocationRequest{
    
    /**
     * @inheritdoc
     */
    
    id: string;

    /**
     * @inheritdoc
     */
    city: string;
    
    /**
     * @inheritdoc
     */
    zip: string;
   
    /**
     * @inheritdoc
     */
    state: string;   
}