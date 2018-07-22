import web3 from 'web3'
import { GAME_NOT_STARTED, GAME_STARTED, GAME_ERROR } from './constants'
import { gameInstance } from './web3Instance'

const gameState = {
  currentState: null,
  currentBid: 0
}

export default gameState

function getGameStage (val) {
  let currentStage = null

  switch (val) {
    case '0':
      currentStage = GAME_NOT_STARTED
      break
    case '1':
      currentStage = GAME_STARTED
      break
    default:
      currentStage = GAME_ERROR
  }

  return currentStage
}

function updateGameForm (status, bid) {
  const formTitle = document.getElementsByClassName('form-title')[0]
  const bidInput = document.getElementsByClassName('initial-bid')[0]
  if (status === GAME_STARTED) {
    formTitle.innerHTML = 'Join to the game'
    bidInput.value = bid
    bidInput.disabled = true
    return false
  }

  // initial value
  formTitle.innerHTML = 'Create game'
  bidInput.value = 1
  bidInput.disabled = false
}

export const syncGameStatus = () => {
  gameInstance.methods.getStage().call().then(result => {
    gameInstance.methods.joinPrice().call().then(joinPrice => {
      const status = getGameStage(result)
      const bid = web3.utils.fromWei(joinPrice)

      gameState.currentState = status
      gameState.currentBid = bid

      updateGameForm(status, bid)

      console.log('Game status -', status)
    })
  })
}
