export class channel {
  id: string;
  name: string;
  description: string;
  usersInChannel: any[] = []
  threads: {};

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.description = obj ? obj.description : '';
    this.usersInChannel = obj ? obj.usersInChannel : '';
    this.threads = obj ? obj.threads : '';
  }

  public toJson() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      usersInChannel: this.usersInChannel,
      threads: this.threads
    }
  }
}
