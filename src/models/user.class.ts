export class User{
    name: string;
    eMail: string;
    password: string;
    avatar: any;

    constructor(obj? : any){
        this.name = obj ? obj.name : '';
        this.eMail = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.avatar = obj ? obj.avatar : '';
    }

    public toJSON() {
        return {
          name: this.name,
          email: this.eMail,
          avatar: this.avatar,
        };
      }
}