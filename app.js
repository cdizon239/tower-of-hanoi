//  GAME DEFAULTS AND STATS
let moves = 0
let selectedTowers = []
let totalNumDiscs = 3
let maxDiscWidth = 18
let towers = [{name: 'towerOne', discs: []},
  {name: 'towerTwo', discs: []},
  {name: 'towerThree', discs:[]}]

//  GETTERS
let towerOne = document.querySelector('#towerOne')
let towerTwo = document.querySelector('#towerTwo')
let towerThree = document.querySelector('#towerThree')

//  INITIALIZE GAMESPACE AND DISCS
const initGameSpace = () => {
  //  clear initial stuff
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

const checkMoveIfValid = (towerA, towerB) => {
  let fromDisk = grabTopmostDisc(towerA) || 0
  let toDisk = grabTopmostDisc(towerB) || 0
  if ((fromDisk < toDisk || isEmptyTower(towerB)) && !isEmptyTower(towerA)) {
    console.log('move from',fromDisk,'to',toDisk,' can move');
    return true
  } else {
    console.log('move from',fromDisk,'to',toDisk,' not valid');
    return false
  }
}

// TO DO: is there a better way to do below?
const move = (towerA, towerB) => {
  let newTowers = []
  towers.forEach(tower => {
    if (tower.name === towerB) {
      newTowers.push(
        {name: `${towerB}`,
        discs: [grabTopmostDisc(towerA), ...tower.discs]
      })
    } else if (tower.name === towerA) {
      newTowers.push(
        {name: `${towerA}`,
        discs: tower.discs.slice(1)
      })
    } else {
      newTowers.push(tower)
    }
  })
  towers = newTowers  
  moves++
  document.querySelector(`#moves`).innerText = `Moves: ${moves}`
  document.querySelector(`#${towerB} ul`).prepend(document.querySelector(`#${towerA} ul`).firstElementChild)
}

const checkForWinAndNextSteps = () => {
  let fullTower = towers.filter(tower => 
    tower.name !== 'towerOne' && tower.discs.length === totalNumDiscs)
  if (fullTower.length > 0) {
    alert('YAYYYY')
  }
}

const towerClickHandler = (e) => {
  let selectedTower = e.currentTarget.id
  selectedTowers.push(selectedTower)
  console.log(selectedTowers, grabTopmostDisc(selectedTower));
  if (selectedTowers.length === 2) {
    if(checkMoveIfValid(selectedTowers[0],selectedTowers[1])) {
      move(selectedTowers[0],selectedTowers[1])
      checkForWinAndNextSteps()
    }
    selectedTowers = []
  }
}

const restartBtnClicked = (e) => {
  moves = 0
  document.querySelector(`#moves`).innerText = `Moves: ${moves}`
  initGameSpace();
}

initGameSpace();
towerOne.addEventListener('click', towerClickHandler)
towerTwo.addEventListener('click', towerClickHandler)
towerThree.addEventListener('click', towerClickHandler)
document.querySelector('#restartBtn').addEventListener('click', restartBtnClicked)
