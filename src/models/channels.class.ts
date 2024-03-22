export class channel {
  name: string;
  description: string;
  usersInChannel: {};
  threads: {};
  
  constructor(obj?: any) {
    this.name = obj ? obj.name : '';
    this.description = obj ? obj.description : '';
    this.usersInChannel = obj ? obj.usersInChannel : '';
    this.threads = obj ? obj.threads : '';
  }

  public toJson(){
    return{
        name: this.name,
        description: this.description,
        usersInChannel: this.usersInChannel,
        threads:this.threads
    }
  }
}
