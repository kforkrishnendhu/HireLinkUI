export interface JwtPayload{
    role?:string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;

    email?:string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?:string;

    sub?:string;
    exp?:number;
}