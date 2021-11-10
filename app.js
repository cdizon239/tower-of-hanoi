//  GAME DEFAULTS AND STATS
let moves = 0
let clickCount = 2
let totalNumDiscs = 10
let towers = [{name: 'towerOne', discs: []},
  {name: 'towerTwo', discs: []},
  {name: 'towerThree', discs:[]}]

//  GETTERS
let towerOne = document.querySelector('#towerOne')
let towerTwo = document.querySelector('#towerTwo')
let towerThree = document.querySelector('#towerThree')

//  INITIALIZE GAMESPACE AND DISCS
const initGameSpace = () => {
  document.querySelectorAll('.tower-top').forEach(tower => {
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
    towerOne.querySelector('ul').append(disc)
  }  
}
initGameSpace();

const isEmptyTower = (towerName) => {
  towers.forEach(tower => {
    tower.name === towerName && tower.discs.length === 0 ? true : false
  })
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

const checkMoveIfValid = () => {}


const checkWin = () => {}

const towerClickHandler = () => {
  //  grab the tower
  // let tower = e.currentTarget.id
  // grab the topmost disc of tower that was clicked
  // let clickedDisc = grabTopmostDisc(tower);
  // check if move was valid
  // erase from previous tower to move to a new one 
  // check win
}


towerOne.addEventListener('click', towerClicked)
towerTwo.addEventListener('click', towerClicked)
towerThree.addEventListener('click', towerClicked)