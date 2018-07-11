//local storage
let store = {user: [], game: []}

//URLs
const userUrl = "http://localhost:3000/api/v1/users"
const gameUrl = "http://localhost:3000/api/v1/games"

//manages current score during game
let activeScore = 0;

//checks if game a game is in progress
let gameActive = false;

//Elements
const playerUl = document.getElementById('player-list');
const timerContainer = document.getElementById('timer-container');
const questionContainer = document.getElementById('question-container');
const answerContainer = document.getElementById('answer-container');
const correctAnswerContainer = document.getElementById('correct-answer-container');
const strikeContainer = document.getElementById('strike-container');
const gameplayContainer = document.getElementById('gameplay-container');
const postGameContainer = document.getElementById("post-game-option-container")
const loginField = document.getElementById("login-field")
const loginButton = document.getElementById("login-button")
const startGameButton = document.getElementById("start-game-button")

fetch(userUrl)
.then(response=>response.json())
.then(data=>displayUser(data))

//Scoreboard display
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

//Gameplay functionality
//generates new question
function mathQuiz() {
  //determintes question type (+, -, *, /)
  questionType = Math.floor((Math.random() * 4) + 1)
  //addition
  if (questionType === 1){
    number1 = Math.floor((Math.random() * 10) + 1)
    number2 = Math.floor((Math.random() * 10) + 1)
    answer = number1 + number2
    return (`${number1} + ${number2}`);
  }

  //subtraction
  else if (questionType === 2) {
    number1 = Math.floor((Math.random() * 10) + 1)
    number2 = Math.floor((Math.random() * 10) + 1)
    answer = number1 - number2
    return(`${number1} - ${number2}`);
  }

  //multiplication
  else if (questionType === 3) {
    number1 = Math.floor((Math.random() * 5) + 1)
    number2 = Math.floor((Math.random() * 5) + 1)
    answer = number1 * number2
    return(`${number1} * ${number2}`);
  }

  //division
  else if (questionType === 4) {
    number1 = Math.floor((Math.random() * 2) + 1)
    number2 = Math.floor((Math.random() * 1) + 1)
    number1 = number1*number2
    answer = number1/number2
    return (`${number1} / ${number2}`);
  }

}

//causing game to end when parameters are met
function gameOver(activeScore){
    gameActive = false //toggles game to inactive so that other functions dont attempt to end game
    disableGameplay();
    alert("GAME OVER!!!")

    //Create elements below game to direct player to scoreboard or restart
    let continueToScoreboard = document.createElement("h1");
    continueToScoreboard.innerText = "Click here to see the scoreboard"
    continueToScoreboard.style.textAlign = "center";
    postGameContainer.append(continueToScoreboard);

    //access real userId when we have object-oriented ready
    let playerName = loginField.value
    let userId = getUserId(playerName);
    addGameBackend(userId, activeScore)
}

//disables DOM functionality so user cannot continue playing after game is over
function disableGameplay(){
  startGameButton.disabled = false
  loginButton.disabled = false
  document.getElementById("submit-answer-button").disabled = false;

  let gameOverText = document.createElement("h4");
  gameOverText.innerText = "GAME OVER!"
  timerContainer.append(gameOverText);
}

//this function obtains user answers and resets question and answer so use can continue playing
//this function operates recursively so that the user can continue playing after answering a question
function answerHandling(answerForm, question, answerInputField, strikes, successCounterTextElement, activeScore){
  let currentQuestion = mathQuiz();
  let userAnswer;
  let newStrike = "X"
  question.innerText = currentQuestion;
  strikes.innerText = "Current strikes: ";

  answerForm.addEventListener("click", function(e){
      e.preventDefault();
      if (e.target.id === "submit-answer-button"){
        let userAnswer = parseInt(e.target.parentElement.getElementsByTagName("INPUT")[0].value);

        //check user answer against actual answer
        if (userAnswer == answer){
          activeScore++
          document.getElementById("answer-input").value = ''; //resets input field to ready for next question
          successCounterTextElement.innerText =`You have correctly answered: ${activeScore}`; //updates the current score
          answerHandling(answerForm, question, strikes); //
        }
        else {
          strikes.innerText += newStrike;
          // display next question if the answer is incorrect
            currentQuestion = mathQuiz()
            question.innerText = currentQuestion;
            document.getElementById("answer-input").value=""
            if (strikes.innerText == "Current strikes:XXX" && (gameActive == true)){
              document.getElementById("timer-text").innerText = `Too many strikes!`
              gameOver(activeScore);
            }
        }
      }
  })
}


//This method setups the DOM for the game.
//Also starts the timer
function gameSetup() {
  questionContainer.innerHTML=""
  timerContainer.innerHTML=""
  answerContainer.innerHTML=""
  correctAnswerContainer.innerHTML=""
  strikeContainer.innerHTML=""
  postGameContainer.innerHTML=""

  //disables buttons when game starts to prevent game duplication
  startGameButton.disabled = true
  loginButton.disabled = true

  //strikes
  let strikes = document.createElement("h1");
  strikes.style.textAlign = "center";
  strikes.style.color = "red";
  strikeContainer.append(strikes)

  //create timer
  let timer = document.createElement("h4");
  timer.style.textAlign = "center";
  timer.id = "timer-text";
  countdown(timer, strikes);
  timerContainer.append(timer);

  //create question
  let question = document.createElement("h2");
  question.style.textAlign = "center";
  questionContainer.append(question);

  //begin counter
  let successCounterTextElement = document.createElement("h1")
  successCounterTextElement.style.textAlign = "center";
  successCounterTextElement.innerText = `You have correctly answered: `;
  correctAnswerContainer.append(successCounterTextElement)

  //create answer form
  let answerForm = document.createElement("form")
  let answerInputField = document.createElement("input")
  let answerSubmitButton = document.createElement("button")

  answerForm.style.textAlign = "center";
  answerSubmitButton.innerText = "Submit answer"

  answerForm.id = "answer-form"
  answerInputField.id = "answer-input"
  answerSubmitButton.id = "submit-answer-button"

  answerForm.append(answerInputField);
  answerForm.append(answerSubmitButton);
  answerContainer.append(answerForm);

  activeScore = 0; //define here so score doesn't reset after — declared at global scope.

  answerHandling(answerForm, question, answerInputField, strikes, successCounterTextElement, activeScore);
}

//These functions manage GET and POST requests with FETCH API
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
   playerUl.innerHTML=" "
   fetch(userUrl)
   .then(response=>response.json())
   .then(data=>displayUser(data))
}


//Start the game by logging in or starting without login
loginButton.addEventListener("click", gameSetup)
startGameButton.addEventListener("click", gameSetup)

function countdown(timer, strikes){
  gameActive = true;
  let timeRemaining = 10; //60 seconds on clock to start

  let gameCountdown = setInterval(function(){
    timeRemaining--;
    if ((timeRemaining >= 0 && gameActive == true)){
      timer.innerText = `There are ${timeRemaining} seconds remaining!`
    }

    else if ((strikes.innerText == "Current strikes:XXX") && gameActive == true){
      timer.innerText = `Too many strikes!`
      gameOver(activeScore)
      clearInterval(gameCountdown)
    }

    else {
      if (gameActive == true){
        timer.innerText = `Out of time!`
        let index = document.getElementsByTagName("h1")[1].innerText.length
        activeScore=parseInt(document.getElementsByTagName("h1")[1].innerText.slice(29,index))
        debugger;
        gameOver(activeScore)
      }
      clearInterval(gameCountdown)
    }
  }, 1000)
}

function getUserId(playerName){
  if (playerName === "Matt"){
    return 1;
  }
  else if (playerName === "Steven"){
    return 2;
  }
}
