export interface IUser{
    _id?: string;
    username: string;
    email: string;
    password: string;
    imgUrl: string;
    isAdmin: Boolean;
    isSuperAdmin: Boolean;
    createdAt?: Date;
    updateddAt?: Date;
}