
export interface ILocationRequest {

    /**
     * Id of the existing location
     */
    id: string

    /**
     * The city of the location
     */
    city: string;

    /**
     * The zip code of the location
     */
    zip: string;

    /**
     * The state of the location
     */
    state: string;
}