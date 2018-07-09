
//local storage
let store = {user: [], game: []}

//URLs
const userUrl = "http://localhost:3000/api/v1/users"
const gameUrl = "http://localhost:3000/api/v1/games"

//Elements
const playerUl = document.getElementById('player-list');


fetch(userUrl)
.then(response=>response.json())
.then(data=>displayUser(data))

function displayUser(data){

  data.forEach(function(individualPlayer){
    playerUl.innerHTML+=`<li>${individualPlayer.name}<ul id=${individualPlayer.id}></ul></li>`
    displayIndividualGame(individualPlayer.games)
  })
}

function displayIndividualGame(games) {
    games.forEach(function(individualGame){
      document.getElementById(`${individualGame.user_id}`).innerHTML+=`<li>Game${individualGame.id}:${individualGame.score}</li>`
    })
}

//Create new user in backend using POST
// name is obtained from the HTML fields
function addUserBackend(name){
  let submissionBody = {
    "name": name,
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


function addGameBackend(userId, score){

  let submissionBody = {
    "user_id": userId,
    "score": score
  }

  function addGame(gameUrl,submissionBody) {
     const postConfig = {
       Accept: "application/json",
       method: "POST",
       headers: {
         "Content-type": "application/json"
       },
       body: JSON.stringify(submissionBody)
     };
     return fetch(gameUrl, postConfig)
   }
   addGame(gameUrl,submissionBody)
}
