
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
const correctCounterContainer = document.getElementById('correct-counter');
const strikeContainer = document.getElementById('strike-container');

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

function answerHandling(answerForm, question, inputField, strikes, correctCounter, correctCounterNum){


  let currentQuestion = mathQuiz();
  // let currentAnswer = answer;
  let userAnswer;
  let newStrike = "X"
  let newCorrect = "|"

  question.innerText = currentQuestion;
  strikes.innerText = "Current strikes: ";

  answerForm.addEventListener("click", function(e){
      e.preventDefault();
      if (e.target.id === "submit-answer"){

        let userAnswer = parseInt(e.target.parentElement.getElementsByTagName("INPUT")[0].value);


        if (userAnswer == answer){
          // alert("Correct!")
          document.getElementById('user-input').value='';
          correctCounter.innerText += newCorrect;
          answerHandling(answerForm, question, strikes);
        }
        else {
          strikes.innerText += newStrike;
          if (strikes.innerText == "Current strikes:XXX"){
            alert("GAME OVER!")
          }

        }

      }
  })

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
    //question.innerText = currentQuestion
    questionContainer.append(question);

    let correctCounter = document.createElement("h1")
    let correctCounterNum = 0;
    correctCounter.style.textAlign = "center";
    correctCounter.innerText = `You have correctly answered: `;
    correctCounterContainer.append(correctCounter)

    //strikes
    let strikes = document.createElement("h1");
    //strikes.innerText = "Current strikes: ";
    strikes.style.textAlign = "center";
    strikes.style.color = "red";
    strikeContainer.append(strikes)


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

    answerHandling(answerForm, question, inputField, strikes, correctCounter, correctCounterNum);

}




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
