export class User{
    name: string;
    eMail: string;
    password: string;
    avatar: any;

    constructor(obj? : any){
        this.name = obj ? obj.name : '';
        this.eMail = obj ? obj.eMail : '';
        this.password = obj ? obj.password : '';
        this.avatar = obj ? obj.avatar : '';
    }

}