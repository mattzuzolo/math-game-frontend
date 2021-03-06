let localUserId = 0;

class User {
  constructor(obj){
    this.localUserId = ++localUserId;
    this.name = obj.name;
    // this.apiId = obj.id;
  }

  displayUser(){
    playerUl.innerHTML+=`<li>${this.name}<ul id=${this.localUserId}></ul></li>`
  }

  addUserBackend(){
    let submissionBody = {
      "name": this.name,
    };
    function addUser(userUrl,submissionBody) {
       const postConfig = {
         Accept: "application/json",
         method: "POST",
         headers: {
           "Content-type": "application/json"
         },
         body: JSON.stringify(submissionBody)
       };
       return fetch(userUrl, postConfig)
     }
     addUser(userUrl,submissionBody);
  }

  createGame(score){
    let newGame = new Game({"user_id": this.localUserId, "score": score})
    store["game"].push(newGame);
    newGame.addGameBackend();
    return newGame
  }
}
