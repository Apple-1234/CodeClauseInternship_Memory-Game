const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue;

//Items array
const items = [
  { name: "bee", image: "bee.png" },
  { name: "crocodile", image: "crocodile.png" },
  { name: "macaw", image: "macaw.png" },
  { name: "gorilla", image: "gorilla.png" },
  { name: "tiger", image: "tiger.png" },
  { name: "monkey", image: "monkey.png" },
  { name: "chameleon", image: "chameleon.png" },
  { name: "piranha", image: "piranha.png" },
  { name: "anaconda", image: "anaconda.png" },
  { name: "sloth", image: "sloth.png" },
  { name: "cockatoo", image: "cockatoo.png" },
  { name: "toucan", image: "toucan.png" },
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;
let score = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
};

//For updating the score
const updateScore = (isCorrectMatch) => {
  if (isCorrectMatch) {
    score += 10; // Increase the score by 10 for each correct match
    scoreDisplay.innerHTML = `<span>Score:</span> ${score}`;
  }
};

// Example usage:
// You need to pass a boolean indicating whether the match is correct or not
updateScore(true); // Update score for a correct match
updateScore(false); // Do not update score for an incorrect match


const checkMatch = () => {
  // Assuming you have a variable called isMatched to check the match
  const isMatched = true; // Replace this with your actual logic

  if (isMatched) {
    updateScore(true); // Call updateScore only when cards are correctly matched
  }
  // Add any other logic for non-matching cards if needed
};

// Example usage:
// Call checkMatch when you want to check if the cards are matched
checkMatch();
// ...
 


//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains the actual image);
        data-card-values is a custom attribute that stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
   <div class="card-container" data-card-value="${cardValues[i].name}">
      <div class="card-before">?</div>
      <div class="card-after">
      <img src="${cardValues[i].image}" class="image"/></div>
   </div>
   `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If the selected card is not matched yet, then only run (i.e., already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the clicked card
        card.classList.add("flipped");
        //if it is the first card (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so the current card will become the firstCard
          firstCard = card;
          //current card's value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since the user selected the second card
          movesCounter();
          //update the score
          updateScore();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match, add the matched class so these cards would be ignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since the next card would be the first now
            firstCard = false;
            //winCount increment as the user found a correct match
            winCount += 1;
            //check if winCount == half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>
            <h4>Score: ${score}</h4>`;
              stopGame();
            }
            updateScore(true);
          } else {
            //if the cards don't match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  score = 0;
  seconds = 0;
  minutes = 0;
  // Clear any existing interval to avoid multiple timers running concurrently
  clearInterval(interval);
  //controls and buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  resetButton.classList.add("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  scoreDisplay.innerHTML = `<span>Score:</span> ${score}`;
  initializer();
});

//Stop game
stopButton.addEventListener("click", () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  resetButton.classList.remove("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
});

//Reset game
resetButton.addEventListener("click", () => {
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  resetButton.classList.add("hide");
  startButton.classList.add("hide");
  clearInterval(interval);
  result.innerText = "";
  // Reset time and moves
  seconds=0;
  minutes= 0;
  movesCount = 0;
  // Reset and update score
  score=0;
  scoreDisplay.innerHTML = `<span>Score:</span> ${score}`;

  // Reset win count
  winCount = 0;
   // Manually update the displayed time
   updateTime();

  // Reinitialize the game

  initializer();
});

// Function to update the displayed time
const updateTime = () => {
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Initialize values and func calls
const initializer = () => {
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};