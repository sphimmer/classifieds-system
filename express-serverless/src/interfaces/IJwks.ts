export interface IJwks{
    keys: IJwk[]
}


interface IJwk{
    alg: string;
    e: string;
    kid: 'RSA';
    kty: string;
    n: string;
    use: string;
}