document.addEventListener("DOMContentLoaded", () => {

let number, tries, time, timer;
let paused = false, over = false;

const guess = document.getElementById("guess");
const result = document.getElementById("result");
const triesEl = document.getElementById("tries");
const timeEl = document.getElementById("time");
const board = document.getElementById("board");
const theme = document.getElementById("theme");

function start() {
    number = Math.floor(Math.random() * 101);
    tries = 0;
    time = 60;
    paused = false;
    over = false;

    triesEl.textContent = tries;
    timeEl.textContent = time;
    result.textContent = "";
    guess.value = "";
    guess.disabled = false;

    clearInterval(timer);
    timer = setInterval(() => {
        if (!paused && !over) {
            time--;
            timeEl.textContent = time;
            if (time === 0) end(false);
        }
    }, 1000);

    loadScores();
}

function check() {
    if (paused || over) return;
    const g = Number(guess.value);

    if (guess.value === "" || g < 0 || g > 100) {
        result.textContent = "⚠ Enter 0–100";
        return;
    }

    tries++;
    triesEl.textContent = tries;

    if (g === number) {
        end(true);
    } else {
        result.textContent = g < number ? "❌ Too Low" : "❌ Too High";
    }

    guess.value = "";
}

function end(win) {
    over = true;
    clearInterval(timer);
    guess.disabled = true;

    if (win) {
        const score = Math.max(0, time * 10 - tries * 5);
        result.innerHTML = `✅ Correct!<br>🏆 ${score}`;
        saveScore(score);
    } else {
        result.textContent = `⏰ Time up! Number was ${number}`;
    }
}

function saveScore(score) {
    let s = JSON.parse(localStorage.getItem("v2scores")) || [];
    s.push(score);
    s.sort((a,b)=>b-a);
    s = s.slice(0,5);
    localStorage.setItem("v2scores", JSON.stringify(s));
    loadScores();
}

function loadScores() {
    let s = JSON.parse(localStorage.getItem("v2scores")) || [];
    board.innerHTML = "<b>🏆 Top Scores</b><br>" +
        (s.length ? s.map((x,i)=>`${i+1}. ${x}`).join("<br>") : "No scores");
}

/* EVENTS */
document.getElementById("submit").onclick = check;
document.getElementById("restart").onclick = start;
guess.addEventListener("keydown", e => e.key === "Enter" && check());

document.addEventListener("keydown", e => {
    if (e.key === " ") { e.preventDefault(); paused = !paused; result.textContent = paused ? "⏸ Paused" : "▶ Resumed"; }
    if (e.key.toLowerCase() === "r") start();
});

theme.onchange = () => {
    document.body.className = theme.value;
    localStorage.setItem("v2theme", theme.value);
};

(function loadTheme(){
    const t = localStorage.getItem("v2theme") || "dark";
    document.body.className = t;
    theme.value = t;
})();

start();
});