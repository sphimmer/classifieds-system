
export interface IJWT {
    /**
     * expiration date of the jwt
     */
    exp: number

    /**
     * User's ID
     */
    sub: string,

    /**
     * user's email
     */
    email: string,

    /**
     * Issue time
     */
    iat: number,

    phone_number: string,

    name: string,
    iss: string
}