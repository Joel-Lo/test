const bgm = new Audio('./Assets/Games-music.mp3');
let die = new Audio('./Assets/dead.mp3');
let hit = new Audio ('./Assets/Hit.mp3');
let sc = new Audio ('./Assets/Scored.mp3');
let eliminated = new Audio ('./Assets/Eliminated.mp3');
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");
const scoreText = document.querySelector(".score-text b");
const highScoreText = document.querySelector(".high-score-text b");
let currentScore = 0;
let highScore = localStorage.getItem("hangmanHighScore") || 0;

highScoreText.innerText = highScore;

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "./Assets/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    const lowerCaseWord = currentWord.toLowerCase();
    wordDisplay.innerHTML = lowerCaseWord.split("").map(letter => {
        if (letter === ' ') {
            correctLetters.push(' ');
            return `<span class="space-separator">${letter}</span>`;
        }
        return `<li class="letter"></li>`;
    }).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {

    if (isVictory) {
        currentScore++;
        scoreText.innerText = currentScore;
        sc.play();
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreText.innerText = highScore;
            localStorage.setItem("hangmanHighScore", highScore);
        }
        resetGame();
    }

    if (!isVictory) {
        bgm.pause();
        bgm.currentTime = 0;
        eliminated.play();

        dieImg = new Image();
        dieImg.src = "./Assets/gun.jpeg";
        dieImg.onload = function(){
            context.drawImage(dieImg, boardWidth / 2.5, boardHeight / 2.5);
        }

        setTimeout(() => {
            hit.play()
        }, 2500);

        setTimeout(() => {
            Swal.fire({
                title: '',
                text: 'Player 456, you have been eliminated.',
                showConfirmButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                timer: 3000,
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    window.location.href = "./index.html";
                }
            });
        }, 4500);
    }
}

const initGame = (button, clickedLetter) => {
    const lowerCaseWord = currentWord.toLowerCase();
    let letterIndex = 0;

    if(lowerCaseWord.includes(clickedLetter)) {
        [...lowerCaseWord].forEach((letter, index) => {
            if(letter !== ' ') {
                if(letter === clickedLetter) {
                    correctLetters.push(letter);

                    wordDisplay.querySelectorAll("li")[letterIndex].innerText = currentWord[index];
                    wordDisplay.querySelectorAll("li")[letterIndex].classList.add("guessed");
                }
                letterIndex++;
            }
        });
    } else {
        wrongGuessCount++;
        hangmanImage.src = `./Assets/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    if(wrongGuessCount === maxGuesses) return gameOver(false);

    if(correctLetters.length === lowerCaseWord.length) return gameOver(true);
}

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}


Swal.fire({
    title: 'Welcome!',
    text: 'Some words may have more than 1 word.',
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    timer: 3000,
}).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer || result.isConfirmed) {
        bgm.loop = true;
        bgm.play();
        getRandomWord();
    }
});

playAgainBtn.addEventListener("click", getRandomWord);
