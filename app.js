//  Game defaults and stats
let moves = 0;
let totalNumDiscs = 10;
let towers = [[],[],[]]

let towerOne = document.querySelector('#towerOne')
let towerTwo = document.querySelector('#towerTwo')
let towerThree = document.querySelector('#towerThree')

//  initialize discs
const initGameSpace = () => {

  document.querySelectorAll('.tower-top').forEach(tower => {
    let discs = document.createElement('ul')
    discs.classList.add('discs')
    tower.append(discs)
  })

  for (let i=0; i<totalNumDiscs; i++) {
    //  add to list
    towers[0].push(i+1)
    //  create the disc and append it to tower one -> tower-top (first-child of tower) -> ul(first-child of tower-top)
    let disc = document.createElement('li')
    disc.id = `disc${i+1}`
    towerOne.firstElementChild.firstElementChild.append(disc)
  }
  console.log(towers);
  
}

initGameSpace()

//  handle clicks to discs
const handleClickEvent = () => {}

// check if move is valid
// move is valid if tower has nothing in it yet, valid if disc 
// erase from previous tower to move to a new one

const checkMoveIfValid = () => {}

const checkIfEmptyTower = () => {}

const grabTopmostDisc = () => {}

const checkWin = () => {}






  