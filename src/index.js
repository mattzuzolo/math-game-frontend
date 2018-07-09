
//local storage
let store = {user: [], game: []}

//URLs
const userUrl = "http://localhost:3000/api/v1/users"
const gameUrl = "http://localhost:3000/api/v1/games"

//Elements
const playerUl = document.getElementById('player-list');
const timerContainer = document.getElementById('timer-container');
const questionContainer = document.getElementById('question-container');
const answerContainer = document.getElementById('answer-container');

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

document.getElementById("start-game").addEventListener("click", gameSetup)

function countdown(timer){
  let startingTime = 60; //60 seconds on clock to start
  setInterval(function(){
    startingTime--;
    timer.innerText = `There are ${startingTime} seconds remaining!`
  }, 1000)
}

function gameSetup() {



    //create timer
    let timer = document.createElement("h4");
    timer.style.textAlign = "center";
    countdown(timer)
    timerContainer.append(timer);

    //create question
    let question = document.createElement("h2");
    question.style.textAlign = "center";
    question.innerText = `5 x 7 = ?`
    questionContainer.append(question);

    //create answer form
    let answerForm = document.createElement("form")
    let inputField = document.createElement("input")
    let submitButton = document.createElement("button")

    answerForm.style.textAlign = "center";
    submitButton.innerText = "Submit answer"

    inputField.id = "user-input"
    submitButton.id = "submit-answer"

    answerForm.append(inputField);
    answerForm.append(submitButton);
    answerContainer.append(answerForm);


}


function mathQuiz() {

  //determintes question type (+, -, *, /)
  questionType=Math.floor((Math.random() * 4) + 1)

  //addition
  if (questionType===1){
    number1=Math.floor((Math.random() * 300) + 1)
    number2=Math.floor((Math.random() * 300) + 1)
    answer=number1+number2
    console.log(`${number1} + ${number2}`)

  //subtraction
  }else if (questionType===2) {
    number1=Math.floor((Math.random() * 300) + 1)
    number2=Math.floor((Math.random() * 300) + 1)
    answer=number1-number2
    console.log(`${number1} - ${number2}`)

  //multiplication
  }else if (questionType===3) {
    number1=Math.floor((Math.random() * 15) + 1)
    number2=Math.floor((Math.random() * 15) + 1)
    answer=number1*number2
    console.log(`${number1} * ${number2}`)

  //division
  }else if (questionType===4) {
    number1=Math.floor((Math.random() * 15) + 1)
    number2=Math.floor((Math.random() * 15) + 1)
   answer=number1/number2
  console.log(`${number1} / ${number2}`)
  }

}
