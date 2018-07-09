let localUserId = 0;

class User {
  constructor(obj){
    this.localUserId = ++localUserId;
    this.name = obj.name;
    this.apiId = obj.id;
  }


}
