//  GAME DEFAULTS AND STATS
let moves = 0
let selectedTowers = []
// let totalNumDiscs = 3
let winRecord = [{numDiscs:3, roundsSolved: 0},
    {numDiscs:4, roundsSolved: 0},
    {numDiscs:5, roundsSolved: 0}]
let maxDiscWidth = 18
let towers = [{name: 'towerOne', discs: []},
  {name: 'towerTwo', discs: []},
  {name: 'towerThree', discs:[]}]

//  GETTERS
let towerOne = document.querySelector('#towerOne')
let towerTwo = document.querySelector('#towerTwo')
let towerThree = document.querySelector('#towerThree')
let winMessage = document.querySelector('#winMessage')
let totalNumDiscs = Number(document.querySelector('#numDiscs').value)

//  INITIALIZE GAMESPACE AND DISCS
const initGameSpace = () => {
  moves = 0
  document.querySelector(`#moves`).innerText = `Moves: ${moves}`
  towers = [{name: 'towerOne', discs: []},
  {name: 'towerTwo', discs: []},
  {name: 'towerThree', discs:[]}]

  document.querySelectorAll('.tower-top').forEach(tower => {
    tower.innerHTML = ''
    let discs = document.createElement('ul')
    discs.classList.add('discs')
    tower.append(discs)
  })
  for (let i=0; i<totalNumDiscs; i++) {
    //  add to list
    towers[0].discs.push(i+1)
    //  create the disc and append it to tower one ul)
    let disc = document.createElement('li')
    disc.id = `disc${i+1}`
    disc.style.width = `${(maxDiscWidth / totalNumDiscs) * (i+1)}vw`
    towerOne.querySelector('ul').append(disc)
  }
  // document.querySelector('#disc1').style.position = 'relative'
  // document.querySelector('#disc1').style.top = '-3rem'

}

const isEmptyTower = (towerName) => {
  let tower = towers.filter(tower => tower.name === towerName)
  return tower[0].discs.length === 0 ? true : false
}

const grabTopmostDisc = (towerName) => {
  let topMostValue
  towers.forEach(tower => {
    if(tower.name === towerName && tower.discs.length >= 1) {
topMostValue = tower.discs[0];
    }
  })
  return topMostValue
}

const checkMoveIfValid = (firstTowerName, secondTowerName) => {
  let fromDisk = grabTopmostDisc(firstTowerName) || 0
  let toDisk = grabTopmostDisc(secondTowerName) || 0
  if ((fromDisk < toDisk || isEmptyTower(secondTowerName)) && !isEmptyTower(firstTowerName)) {
    console.log('move from',fromDisk,'to',toDisk,' can move');
    return true
  } else {
    console.log('move from',fromDisk,'to',toDisk,' not valid');
    return false
  }
}

// TO DO: is there a better way to do below?
const move = (firstTowerName, secondTowerName) => {
  let newTowers = []
  towers.forEach(tower => {
    if (tower.name === secondTowerName) {
      newTowers.push(
        {name: `${secondTowerName}`,
        discs: [grabTopmostDisc(firstTowerName), ...tower.discs]
      })
    } else if (tower.name === firstTowerName) {
      newTowers.push(
        {name: `${firstTowerName}`,
        discs: tower.discs.slice(1)
      })
    } else {
      newTowers.push(tower)
    }
  })
  towers = newTowers  
  moves++
  document.querySelector(`#moves`).innerText = `Moves: ${moves}`
  // move firstChild of tower A to secondTowerName
  document.querySelector(`#${secondTowerName} ul`).prepend(document.querySelector(`#${firstTowerName} ul`).firstElementChild)
}

const checkForWinAndNextSteps = () => {
  // check if 2 or 3 are full
  console.log(totalNumDiscs);
  let fullTower = towers.filter(tower => 
    tower.name !== 'towerOne' && tower.discs.length == totalNumDiscs)

  // record score and prompt use they won the round
  if (fullTower.length > 0) {
    // add to number of rounds won, with right disc number
    // if disc number not in winRecord yet, then push it to the list
    if (winRecord.filter(discCategory => discCategory.numDiscs == totalNumDiscs).length === 0) {
      let newCategory = {numDiscs: Number(`${totalNumDiscs}`), roundsSolved: 0}
      winRecord.push(newCategory)}
    winRecord.forEach(discCategory => {
      if(discCategory.numDiscs == totalNumDiscs) {
        discCategory.roundsSolved ++
      }})
    console.log(winRecord)    
    // win message 
    winMessage.style.display = 'block'
  }
}

const towerClickHandler = (e) => {
  let selectedTower = e.currentTarget.id
  selectedTowers.push(selectedTower)
  if (selectedTowers.length === 2) {
    if(checkMoveIfValid(selectedTowers[0],selectedTowers[1])) {
      move(selectedTowers[0],selectedTowers[1])
      checkForWinAndNextSteps()
    }
    selectedTowers = []
  }
}

const autoMove = (firstTowerName, secondTowerName) => {
  let firstTowerNumDiscs = towers.filter(tower => tower.name === firstTowerName)[0].discs.length
  let secondTowerNumDiscs = towers.filter(tower => tower.name === secondTowerName)[0].discs.length
  
  if (firstTowerNumDiscs === 0 && secondTowerNumDiscs > 0) {
    console.log(`${firstTowerName} is empty`)
    move(secondTowerName, firstTowerName)
  } else if (secondTowerNumDiscs === 0 && firstTowerNumDiscs > 0) {
    move(firstTowerName, secondTowerName)
  } else if (grabTopmostDisc(firstTowerName) > grabTopmostDisc(secondTowerName)) {
    move(secondTowerName, firstTowerName)
  } else {
    move(firstTowerName, secondTowerName)
  }
  console.log(towers)
}


const restartBtnClicked = (e) => {
  initGameSpace();
}

const solvePuzzle = async () => {
  initGameSpace();
  let minimumMoves = (2 ** totalNumDiscs) - 1
  let towerA = 'towerOne'
  let towerB = 'towerTwo'
  let towerC = 'towerThree'
  console.log(minimumMoves)
  if (totalNumDiscs % 2 === 0) {
    towerB = 'towerThree'
    towerC = 'towerTwo'
  }

  for (let i=1; i<= minimumMoves; i++) {
    console.log(i)
    if ( i % 3 === 1) {
      await new Promise((res, rej) => {
        autoMove(towerA, towerC)
        setTimeout(() => {res()}, 1000)
      })
    } else if (i % 3 === 2) {
      await new Promise((res, rej) => {
        autoMove(towerA, towerB)
        setTimeout(() => {res()}, 1000)
      })    
    } else if (i % 3 === 0) {
      await new Promise((res, rej) => {
        autoMove(towerB, towerC)
        setTimeout(() => {res()}, 1000)
      })
    }
  }
}


// const solvePuzzle = () => {
//   initGameSpace();
//   let minimumMoves = (2 ** totalNumDiscs) - 1
//   let towerA = 'towerOne'
//   let towerB = 'towerTwo'
//   let towerC = 'towerThree'
//   console.log(minimumMoves)
//   if (totalNumDiscs % 2 === 0) {
//     towerB = 'towerThree'
//     towerC = 'towerTwo'
//   }

//   for (let i=1; i<= minimumMoves; i++) {
//     console.log(i)
//     if ( i % 3 === 1) {
//       setTimeout(autoMove(towerA, towerC), 3000)
//     } else if (i % 3 === 2) {
//       setTimeout(autoMove(towerA, towerB), 3000)
//     } else if (i % 3 === 0) {
//       setTimeout(autoMove(towerB, towerC),3000)
//     }
//   }
// }

initGameSpace()
solvePuzzle()

// TESTING
// autoMove('towerOne','towerThree');
// autoMove('towerOne','towerTwo');
// autoMove('towerTwo','towerThree');
// autoMove('towerOne','towerThree');
// autoMove('towerOne','towerTwo');
// autoMove('towerTwo','towerThree');
// autoMove('towerOne','towerThree');


// Event listeners to move discs
towerOne.addEventListener('click', towerClickHandler)
towerTwo.addEventListener('click', towerClickHandler)
towerThree.addEventListener('click', towerClickHandler)
// Listener to restart game
document.querySelector('#restartBtn').addEventListener('click', restartBtnClicked)
// Listern to close win modal
document.querySelector('#closeWinMessage').addEventListener('click', () => {
  winMessage.style.display = 'none'
  initGameSpace();
})
// Increase or decrease number of discs
document.querySelector('#generateNumDiscs').addEventListener('submit', (e) => {
  e.preventDefault()
  totalNumDiscs = document.querySelector('#numDiscs').value
  initGameSpace()
})

