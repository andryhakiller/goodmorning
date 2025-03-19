const board = document.getElementById("board");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset");
const cells = document.querySelectorAll(".cell");
const nameModal = document.getElementById("nameModal");
const playerNameInput = document.getElementById("playerName");
const startGameButton = document.getElementById("startGame");

let currentPlayer = "X"; // Игрок всегда начинает с "X"
let gameState = ["", "", "", "", "", "", "", "", ""]; // Состояние игры
let playerName = ""; // Имя игрока
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Горизонтальные линии
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Вертикальные линии
    [0, 4, 8], [2, 4, 6] // Диагонали
];

// Показ модального окна при загрузке страницы
window.onload = () => {
    nameModal.style.display = "flex";
};

// Начало игры после ввода имени
startGameButton.addEventListener("click", () => {
    playerName = playerNameInput.value.trim();
    if (playerName === "") {
        alert("Пожалуйста, введите ваше имя!");
        return;
    }
    nameModal.style.display = "none";
    message.textContent = `${playerName}, ваш ход!`;
});

// Обработка хода игрока
function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute("data-index");

    if (gameState[index] !== "" || !isGameActive()) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin()) {
        if (currentPlayer === "X") {
            message.textContent = `Доброе утро, ${playerName}!`;
        } else {
            message.textContent = "Злого вечера враги.";
        }
        endGame();
        return;
    }

    if (isBoardFull()) {
        message.textContent = "Нет достоверных сведений о добрости утра.";
        endGame();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Переход хода
    if (currentPlayer === "O") {
        computerMove();
    }
}

// Ход компьютера
function computerMove() {
    let emptyCells = gameState
        .map((value, index) => (value === "" ? index : null))
        .filter((index) => index !== null);

    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomIndex] = "O";
    cells[randomIndex].textContent = "O";
    cells[randomIndex].classList.add("O");

    if (checkWin()) {
        message.textContent = "Злого вечера враги.";
        endGame();
        return;
    }

    if (isBoardFull()) {
        message.textContent = "Нет достоверных сведений о добрости утра.";
        endGame();
        return;
    }

    currentPlayer = "X"; // Возврат хода к игроку
    message.textContent = `${playerName}, ваш ход!`;
}

// Проверка победы
function checkWin() {
    return winningConditions.some((condition) => {
        return condition.every((index) => {
            return gameState[index] === currentPlayer;
        });
    });
}

// Проверка на ничью
function isBoardFull() {
    return gameState.every((cell) => cell !== "");
}

// Завершение игры
function endGame() {
    cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
}

// Сброс игры
function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });
    message.textContent = `${playerName}, ваш ход!`;
    currentPlayer = "X";
    cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
}

// Проверка активности игры
function isGameActive() {
    return !checkWin() && !isBoardFull();
}

// Инициализация
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);