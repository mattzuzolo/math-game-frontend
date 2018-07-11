let localGameId = 0;

class Game {
  constructor(obj){
    this.localGameId = ++localGameId;
    this.score = obj.score;
    this.apiId = obj.id;
    this.userId = obj.user_id;
  }
  displayGame() {
    document.getElementById(`${this.userId}`).innerHTML+=`<li>Game${this.localGameId}:${this.score}</li>`
  }

}
