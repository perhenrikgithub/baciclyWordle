const wordOfDay = "later";

let keyboard = document.getElementById("keyboard");
keyboard.addEventListener("click", getLetter);

let activeRow = 1; // which row player writes to
let activeColumn = 1; // which column player writes to
let score = 0; //number of correct letters

// runs whenever screenkeyboard is used
function getLetter(evt) {
    if (score < 5) {
        let letter = evt.target.dataset.letter;
        // removes clickability of row/container
        if (evt.target.className != "row") {
            write(letter);
        }
    }
}

// runs whenever physical keyboard is used (pc)
const allowedKeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "æ", "ø", "å", "Enter", "Backspace"];
document.onkeydown = function (evt) {
    var letter = evt.key;

    if (allowedKeys.includes(letter)) {
        if (letter == "Backspace") {
            backspace();
            return;
        }
        if (letter == "Enter") {
            enter();
            return;
        }
        write(letter);
    }
};

function write(letter) {
    let el = document.querySelector("#game :nth-child(" + activeRow + ") :nth-child(" + activeColumn + ")");
    // backspace or enter clicked
    if (letter === "Enter") {
        enter();
    } else if (letter == "Backspace") {
        backspace();
    } else {
        // letter pressed (NOT backspace/enter)
        if (activeColumn <= 5) {
            // more space in row
            el.innerHTML = letter; // writes letter
            el.dataset.state = "filled"; // changes state of tile
            activeColumn += 1; // sets active column as next tile
        } else {
            // row full
            errorAnimation();
        }
    }
}

function errorAnimation() {
    let row = document.querySelector("#game :nth-child(" + activeRow + ")");
    row.animate(
        [
            // keyframes
            { transform: "translateX(0.8em)" },
            { transform: "translateX(0)" },
            { transform: "translateX(-0.8em)" },
            { transform: "translateX(0)" },
        ],
        {
            // timing options
            duration: 85,
            iterations: 2,
        }
    );
    let emptyTiles = document.querySelectorAll("#game :nth-child(" + activeRow + ") *[data-state='empty']");
    for (let i = 0; i < emptyTiles.length; i++) {
        emptyTiles[i].animate(
            [
                // keyframes
                { border: "1px solid lightgray" },
                { border: "1px solid red" },
                { border: "1px solid lightgray" },
            ],
            {
                // timing options
                delay: 85,
                duration: 850,
                iterations: 1,
            }
        );
    }
}

function validateAwnser(word) {
    // runs 5 times (per position / per column)
    for (let i = 0; i < word.length; i++) {
        let y = i + 1;
        let el = document.querySelector("#game :nth-child(" + activeRow + ") :nth-child(" + y + ")");
        let keyEl = document.querySelector("[data-letter='" + word.charAt(i) + "']");
        // if letter in colimn i is part of word of the day (yellow)
        if (wordOfDay.includes(word.charAt(i))) {
            el.dataset.state = "somewhatCorrect";
            // keyboard
            keyEl.style.background = "#f3feb0"; // yellow
            keyEl.style.color = "black";
        } else {
            el.dataset.state = "wrong";
            // keyboard
            keyEl.classList += " used"; // gray
        }
        // if letter in column i is same as letter in same position (green) (overwrites includes() if true)
        if (wordOfDay.charAt(i) == word.charAt(i)) {
            score += 1;
            el.dataset.state = "correct";
            // keyboard
            keyEl.style.background = "#08a66c"; // green
            keyEl.style.color = "white";
        }
    }
    if (score >= 5) {
        // game over -> win
        document.onkeydown = null; // removes keyboard eventlister
    } else {
        // game still ongoing, resets score for next word (next try)
        score = 0;
    }

    if (activeRow <= 6) {
        // if more rows available
        activeRow += 1; // move to next row
        activeColumn = 1; // set column as first column
    } else {
        // no more rows available -> game over
    }
}

function backspace() {
    // changes activeColumn to last column with letter (if there are any)
    if (activeColumn > 1) {
        activeColumn -= 1;
    }
    let el = document.querySelector("#game :nth-child(" + activeRow + ") :nth-child(" + activeColumn + ")");
    // removes letter
    el.innerHTML = "";
    // changes state of element
    el.dataset.state = "empty";
}

function enter() {
    // input = nodelist of all 5 letter-elements
    let input = document.querySelectorAll("#game :nth-child(" + activeRow + ") *");
    let word = "";
    for (let i = 0; i < input.length; i++) {
        let letter = input[i].innerHTML;
        word += letter; // adds to each letters to word variable
    }

    // if word too short ->
    if (word.length < 5) {
        errorAnimation();
    } else {
        validateAwnser(word);
    }
}
