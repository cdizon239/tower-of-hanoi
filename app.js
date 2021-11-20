//  GAME DEFAULTS AND STATS
let moves = 0;
let selectedTowers = [];
let storedWins = JSON.parse(localStorage.getItem("storedWins"));

let maxDiscWidth = 24;
let towers = [
  { name: "towerOne", discs: [] },
  { name: "towerTwo", discs: [] },
  { name: "towerThree", discs: [] },
];

//  GETTERS
let towerOne = document.querySelector("#towerOne");
let towerTwo = document.querySelector("#towerTwo");
let towerThree = document.querySelector("#towerThree");
let winModal = document.querySelector("#winModal");
let winText = document.querySelector("#winText");
let statsModal = document.querySelector("#gameStatsModal");
let totalNumDiscs = Number(document.querySelector("#numDiscs").value);

//  INITIALIZE GAMESPACE AND DISCS
const initGameSpace = () => {
  moves = 0;
  document.querySelector(`#moves`).innerText = `Moves: ${moves}`;
  towers = [
    { name: "towerOne", discs: [] },
    { name: "towerTwo", discs: [] },
    { name: "towerThree", discs: [] },
  ];

  document.querySelectorAll(".tower-top").forEach((tower) => {
    tower.innerHTML = "";
    let discs = document.createElement("ul");
    discs.classList.add("discs");
    tower.append(discs);
  });
  for (let i = 0; i < totalNumDiscs; i++) {
    //  add to list
    towers[0].discs.push(i + 1);
    //  create the disc and append it to tower one ul)
    let disc = document.createElement("li");
    disc.id = `disc${i + 1}`;
    disc.style.width = `${(maxDiscWidth / totalNumDiscs) * (i + 1)}vw`;
    towerOne.querySelector("ul").append(disc);
  }
  // document.querySelector('#disc1').style.position = 'relative'
  // document.querySelector('#disc1').style.top = '-3rem'
};

// GAME HELPER FUNCTIONS
const isEmptyTower = (towerName) => {
  let tower = towers.filter((tower) => tower.name === towerName);
  return tower[0].discs.length === 0 ? true : false;
};
const grabTopmostDisc = (towerName) => {
  let topMostValue;
  towers.forEach((tower) => {
    if (tower.name === towerName && tower.discs.length >= 1) {
      topMostValue = tower.discs[0];
    }
  });
  return topMostValue;
};
const checkMoveIfValid = (firstTowerName, secondTowerName) => {
  let fromDisk = grabTopmostDisc(firstTowerName) || 0;
  let toDisk = grabTopmostDisc(secondTowerName) || 0;
  if (
    (fromDisk < toDisk || isEmptyTower(secondTowerName)) &&
    !isEmptyTower(firstTowerName)
  ) {
    console.log("move from", fromDisk, "to", toDisk, " can move");
    return true;
  } else {
    console.log("move from", fromDisk, "to", toDisk, " not valid");
    return false;
  }
};
const move = (firstTowerName, secondTowerName) => {
  let newTowers = [];
  towers.forEach((tower) => {
    if (tower.name === secondTowerName) {
      newTowers.push({
        name: `${secondTowerName}`,
        discs: [grabTopmostDisc(firstTowerName), ...tower.discs],
      });
    } else if (tower.name === firstTowerName) {
      newTowers.push({
        name: `${firstTowerName}`,
        discs: tower.discs.slice(1),
      });
    } else {
      newTowers.push(tower);
    }
  });
  towers = newTowers;
  moves++;
  document.querySelector(`#moves`).innerText = `Moves: ${moves}`;
  // move firstChild of tower A to secondTowerName
  document
    .querySelector(`#${secondTowerName} ul`)
    .prepend(document.querySelector(`#${firstTowerName} ul`).firstElementChild);
};
const autoMove = (firstTowerName, secondTowerName) => {
  let firstTowerNumDiscs = towers.filter(
    (tower) => tower.name === firstTowerName
  )[0].discs.length;
  let secondTowerNumDiscs = towers.filter(
    (tower) => tower.name === secondTowerName
  )[0].discs.length;

  if (
    (firstTowerNumDiscs === 0 && secondTowerNumDiscs > 0) ||
    grabTopmostDisc(firstTowerName) > grabTopmostDisc(secondTowerName)
  ) {
    move(secondTowerName, firstTowerName);
  } else {
    move(firstTowerName, secondTowerName);
  }
};

const storeScore = () => {
  //  if list is null (i.e. not in local storage yet)
  if (!storedWins) {
    storedWins = [];
  }
  // check if discNum category is not inlist, make a new object and push to list
  if (
    storedWins.filter((discCategory) => discCategory.numDiscs == totalNumDiscs)
      .length === 0
  ) {
    let newCategory = {
      numDiscs: Number(`${totalNumDiscs}`),
      roundsSolved: 0,
      bestNumMoves: moves,
    };
    storedWins.push(newCategory);
  }
  // store the best score at a given round/disc number
  storedWins.forEach((discCategory) => {
    if (discCategory.numDiscs == totalNumDiscs) {
      discCategory.roundsSolved++;
      if (discCategory.bestNumMoves > moves || discCategory.bestNumMoves == 0) {
        discCategory.bestNumMoves = moves;
      }
    }
  });
  // sort and update local storage
  storedWins = storedWins.sort((a, b) => a.numDiscs - b.numDiscs);
  localStorage.setItem("storedWins", JSON.stringify(storedWins));
};

//  CHECK FOR WINNING CONDITION
const checkForWinAndNextSteps = () => {
  // check if towers 2 or 3 are full
  let fullTower = towers.filter(
    (tower) => tower.name !== "towerOne" && tower.discs.length == totalNumDiscs
  );

  // record score and prompt use they won the round
  if (fullTower.length > 0) {
    storeScore();
    stopTimer();
    // win message
    winText.innerHTML = `Congratulations! <br>You solved the ${totalNumDiscs}-disc puzzle with ${moves} moves. <br>${time.innerText}`;
    winModal.classList.toggle("hide");
  }
};

// TIMER
let currentTimer;
let timer = document.querySelector("#time");
let seconds = 0;
let minutes = 0;
let hours = 0;
let puzzleNotYetSolved = true;
// Not DRY yet!
const timerFunction = () => {
  if (puzzleNotYetSolved === true) {
    seconds = parseInt(seconds);
    minutes = parseInt(minutes);
    hours = parseInt(hours);
    //  increment by a second
    seconds++;
    //  less than 10: ss, mm, hh
    if (seconds < 10 && seconds >= 0) {
      seconds = "0" + seconds;
    }
    if (minutes < 10 && minutes >= 0) {
      minutes = "0" + minutes;
    }
    if (hours < 10 && hours >= 0) {
      hours = "0" + hours;
    }
    if (seconds > 59) {
      minutes = minutes + 1;
      seconds = 0;
    }
    if (minutes > 59) {
      hours = hours + 1;
      minutes = 0;
      seconds = 0;
    }
    timer.innerHTML = `Time: ${hours}:${minutes}:${seconds}`;
  }
};
const startTimer = (e) => {
  clearInterval(currentTimer);
  currentTimer = setInterval(timerFunction, 1000);
  e.currentTarget.removeEventListener("click", startTimer);
};
function stopTimer() {
  puzzleNotYetSolved = false;
  clearInterval(currentTimer);
}
function resetTimer() {
  puzzleNotYetSolved = true;
  clearInterval(currentTimer);
  seconds = 0;
  minutes = 0;
  hours = 0;
  timer.innerHTML = "Time: 00:00:00";
}

//  CLICK HANDLERS
const towerClickHandler = (e) => {
  let selectedTower = e.currentTarget.id;
  selectedTowers.push(selectedTower);
  if (selectedTowers.length === 2) {
    if (checkMoveIfValid(selectedTowers[0], selectedTowers[1])) {
      move(selectedTowers[0], selectedTowers[1]);
      checkForWinAndNextSteps();
    }
    selectedTowers = [];
  }
};
const restartBtnClicked = (e) => {
  puzzleNotYetSolved = true;
  initGameSpace();
  resetTimer();
  document.querySelector(".container").addEventListener("click", startTimer);
};
const solvePuzzle = async () => {
  initGameSpace();
  let towerA = "towerOne";
  let towerB = "towerTwo";
  let towerC = "towerThree";

  let countOfEmptyTowers =
    towers.filter((tower) => tower.discs.length === 0).length - 1;

  while (countOfEmptyTowers < 2) {
    let numAutoMoves = moves + 1;
    if (numAutoMoves % 3 === 1) {
      await new Promise((res) => {
        autoMove(towerA, towerC);
        setTimeout(() => {
          res();
        }, 500);
      });
    } else if (numAutoMoves % 3 === 2) {
      await new Promise((res) => {
        autoMove(towerA, towerB);
        setTimeout(() => {
          res();
        }, 500);
      });
    } else if (numAutoMoves % 3 === 0) {
      await new Promise((res) => {
        autoMove(towerB, towerC);
        setTimeout(() => {
          res();
        }, 500);
      });
    }
    countOfEmptyTowers = towers.filter(
      (tower) => tower.discs.length === 0
    ).length;
  }
};
const seeGameStats = () => {
  const statsContent = document.querySelector("#gameStatsContent");
  statsContent.innerHTML = "";
  if (!storedWins || storedWins.length === 0) {
    let playMessage = document.createElement("p");
    playMessage.innerText =
      "Play to start seeing how awesome you could be at this puzzle";
  } else {
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
      <tr>
        <th>Discs</th>
        <th>Rounds Solved</th>
        <th>Best # Moves</th>
      </tr>
    </thead>`;

    storedWins.forEach((discRecord) => {
      const infoRow = document.createElement("tr");
      infoRow.innerHTML = `<td>${discRecord.numDiscs}</td>
      <td>${discRecord.roundsSolved}</td>
      <td>${discRecord.bestNumMoves}</td>`;
      table.append(infoRow);
    });
    statsContent.prepend(table);
  }
  console.log(storedWins);
  statsModal.classList.toggle("hide");
};

initGameSpace();
// EVENT LISTENERS
// Start timer on first click
let gameSpace = document.querySelector(".container");
gameSpace.addEventListener("click", startTimer);
// Event listeners to move discs
towerOne.addEventListener("click", towerClickHandler);
towerTwo.addEventListener("click", towerClickHandler);
towerThree.addEventListener("click", towerClickHandler);
// Listener to restart game
document
  .querySelector("#restartBtn")
  .addEventListener("click", restartBtnClicked);
// Listern to close win modal
document.querySelector("#closeWinMessage").addEventListener("click", () => {
  winModal.classList.toggle("hide");
  initGameSpace();
  resetTimer();
  document.querySelector(".container").addEventListener("click", startTimer);
});
// Increase or decrease number of discs
document.querySelector("#generateNumDiscs").addEventListener("submit", (e) => {
  e.preventDefault();
  totalNumDiscs = document.querySelector("#numDiscs").value;
  initGameSpace();
});
// Listen for solve button
document.querySelector("#solveBtn").addEventListener("click", solvePuzzle);
document.querySelector("#statsBtn").addEventListener("click", seeGameStats);

document.querySelector("#closeGameStats").addEventListener("click", () => {
  statsModal.classList.toggle("hide");
});
