export class User{
    name: string;
    eMail: string;
    password: string;
    avatar: any;
    id:any;

    constructor(obj? : any){
        this.name = obj ? obj.name : '';
        this.eMail = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.avatar = obj ? obj.avatar : '';
        this.id = obj ? obj.id : '';
    }

    public toJSON() {
        return {
          name: this.name,
          email: this.eMail,
          avatar: this.avatar,
          id: this.id,
        };
      }

      
}