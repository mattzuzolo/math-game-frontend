//local storage
let store = {user: [], game: []}

//URLs
const userUrl = "http://localhost:3000/api/v1/users"
const gameUrl = "http://localhost:3000/api/v1/games"

//Active toggle
let gameActive = false;
let activeScore = 0;

//Elements
const playerUl = document.getElementById('player-list');
const timerContainer = document.getElementById('timer-container');
const questionContainer = document.getElementById('question-container');
const answerContainer = document.getElementById('answer-container');
const correctCounterContainer = document.getElementById('correct-counter');
const strikeContainer = document.getElementById('strike-container');
const gameplayContainer = document.getElementById('gameplay-container');
const postGameContainer = document.getElementById("post-game-option-container")
const loginField = document.getElementById("user")

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
  questionType=Math.floor((Math.random() * 4) + 1)

  //addition
  if (questionType===1){
    number1=Math.floor((Math.random() * 10) + 1)
    number2=Math.floor((Math.random() * 10) + 1)
    answer=number1+number2
    return(`${number1} + ${number2}`)

  //subtraction
  }else if (questionType===2) {
    number1=Math.floor((Math.random() * 10) + 1)
    number2=Math.floor((Math.random() * 10) + 1)
    answer=number1-number2
    return(`${number1} - ${number2}`)

  //multiplication
  }else if (questionType===3) {
    number1=Math.floor((Math.random() * 5) + 1)
    number2=Math.floor((Math.random() * 5) + 1)
    answer=number1*number2
    return(`${number1} * ${number2}`)

  //division
  }else if (questionType===4) {
    number1=Math.floor((Math.random() * 2) + 1)
    number2=Math.floor((Math.random() * 1) + 1)
    number1=number1*number2
    answer=number1/number2
    return`${number1} / ${number2}`
  }

}

//causing game to end when parameters are met
function gameOver(activeScore){
  // debugger;
    gameActive = false
    disableGameplay();
    alert("GAME OVER!!!")
    let continueToScoreboard = document.createElement("h1");
    continueToScoreboard.innerText = "Click here to see the scoreboard"
    continueToScoreboard.style.textAlign = "center";
    postGameContainer.append(continueToScoreboard);
    //access real userId when we have OO ready
    let playerName = loginField.value
    let userId = getUserId(playerName);
    addGameBackend(userId, activeScore)
      document.getElementById("submit-answer").disabled = false;
      document.getElementById('start-game').disabled = false
      document.getElementById('button').disabled = false
      // document.getElementById('gameplay-container').innerHTML=
}

//disables DOM functionality so user cannot continue playing after game is over
function disableGameplay(){
  document.getElementById("submit-answer").disabled = true;
//  timerContainer.remove(document.getElementById("timer-text"))

  let gameOverText = document.createElement("h4");
  gameOverText.innerText = "GAME OVER!"
  timerContainer.append(gameOverText);
}

//this function obtains user answers and resets question and answer so use can continue playing
//this function operates recursively so that the user can continue playing after answering a question
function answerHandling(answerForm, question, inputField, strikes, correctCounter, correctCounterNum, activeScore){
  let currentQuestion = mathQuiz();
  let userAnswer;
  let newStrike = "X"
  question.innerText = currentQuestion;
  strikes.innerText = "Current strikes: ";

  answerForm.addEventListener("click", function(e){
      e.preventDefault();
      if (e.target.id === "submit-answer"){
        let userAnswer = parseInt(e.target.parentElement.getElementsByTagName("INPUT")[0].value);

        //check user answer against actual answer
        if (userAnswer == answer){
          activeScore++
          document.getElementById('user-input').value = ''; //resets input field to ready for next question
          correctCounter.innerText =`You have correctly answered: ${activeScore}`; //updates the current score
          answerHandling(answerForm, question, strikes); //
        }
        else {
          strikes.innerText += newStrike;
          // display next question if the answer is incorrect
            currentQuestion = mathQuiz()
            question.innerText = currentQuestion;
            document.getElementById("user-input").value=""
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
  correctCounterContainer.innerHTML=""
  strikeContainer.innerHTML=""
  postGameContainer.innerHTML=""

  document.getElementById('start-game').disabled = true
  document.getElementById('button').disabled = true

  //strikes
    let strikes = document.createElement("h1");
    //strikes.innerText = "Current strikes: ";
    strikes.style.textAlign = "center";
    strikes.style.color = "red";
    strikeContainer.append(strikes)

    //create timer
    let timer = document.createElement("h4");
    timer.style.textAlign = "center";
    timer.id = "timer-text"
    // expireTime()
    countdown(timer, strikes)
    timerContainer.append(timer);

    //create question
    let question = document.createElement("h2");
    question.style.textAlign = "center";
    //question.innerText = currentQuestion
    questionContainer.append(question);

    let correctCounter = document.createElement("h1")
    let correctCounterNum = 0;
    correctCounter.style.textAlign = "center";
    correctCounter.innerText = `You have correctly answered: `;
    correctCounterContainer.append(correctCounter)



    //create answer form
    let answerForm = document.createElement("form")
    let inputField = document.createElement("input")
    let submitButton = document.createElement("button")

    answerForm.style.textAlign = "center";
    submitButton.innerText = "Submit answer"

    answerForm.id = "answer-form"
    inputField.id = "user-input"
    submitButton.id = "submit-answer"

    answerForm.append(inputField);
    answerForm.append(submitButton);
    answerContainer.append(answerForm);

    activeScore = 0; //define here so score doesn't reset after

    answerHandling(answerForm, question, inputField, strikes, correctCounter, correctCounterNum, activeScore);
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
  console.log("Your score will be submitted to the API momentarily")
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


//Start the game by clicking start
document.getElementById("start-game").addEventListener("click", gameSetup)

function countdown(timer, strikes){
  gameActive = true;
  let startingTime = 10; //60 seconds on clock to start
  let gameCountdown = setInterval(function(){
    startingTime--;
    if ((startingTime >= 0 && gameActive == true)){
      timer.innerText = `There are ${startingTime} seconds remaining!`
    }
    else if ((strikes.innerText == "Current strikes:XXX") && gameActive == true){
      timer.innerText = `Too many strikes!`
      gameOver(activeScore)
      clearInterval(gameCountdown)
    }
    else {
      if (gameActive == true){
        // debugger;
        timer.innerText = `Out of time!`
        index=document.getElementsByTagName("h1")[0].innerText.length
        activeScore=parseInt(document.getElementsByTagName("h1")[0].innerText.slice(29,index))

        gameOver(activeScore)
      }
      clearInterval(gameCountdown)
    }
  }, 1000)

}

// function countdown(timer){
//   let startingTime = 10; //60 seconds on clock to start
//   setInterval(function(){
//     startingTime--;
//     if (startingTime >= 0){
//       debugger;
//       timer.innerText = `There are ${startingTime} seconds remaining!`
//     } else {
//       debugger;
//       countdown().clearInterval(timer)
//       gameOver()
//     }
//   }, 1000)
// }

// function expireTime(){
//   // let startingTime = 60; //60 seconds on clock to start
//   // startingTime--;
//   window.setTimeout(function(){
//     gameOver();
//   }, 60000)
// }

function getUserId(playerName){
  if (playerName === "Matt"){
    return 1;
  }
  else if (playerName === "Steven"){
    return 2;
  }
}


let button=document.getElementById("button")
button.addEventListener("click",gameSetup)
