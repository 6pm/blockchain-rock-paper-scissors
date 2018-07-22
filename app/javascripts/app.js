// Import the page's CSS. Webpack will know what to do with it.
import '../css/app.css'
import '../css/normalize.css'

import web3 from 'web3'

import { contractAddress } from './../../contractAddress.json'

import { web3Instance, gameInstance } from './web3Instance'
import { syncGameStatus } from './gameStatus'

web3Instance.eth.defaultAccount = '0x627306090abab3a6e1400e9345bc60c78a8bef57'

// ---------------------------------
window.onload = () => {
  // initial load
  updateAddresses()
  syncGameStatus()
  getGamePlayers()

  const createGameBtn = document.getElementsByClassName('create-game')[0]

  createGameBtn.addEventListener('click', e => {
    const value = document.getElementsByClassName('initial-bid')[0].value
    const address = document.getElementsByClassName('create-address')[0].value
    const bid = document.querySelector('input[name="bid"]:checked').value

    makeBid(address, contractAddress, value, bid)
  })

  // ----------------------------------------
  // check balance
  const addressSelector = document.getElementById('addresses')
  addressSelector.addEventListener('change', e => {
    web3Instance.eth.getBalance(addressSelector.value).then(data => {
      console.log(addressSelector.value, ' balance - ', Number(web3.utils.fromWei(data)).toFixed(2))
    })
  })
  // ----------------------------------------

  // events
  const showWinner = () => gameInstance.getPastEvents('GetWinner', {
    // filter: {_from: addr},
    // fromBlock: 0,
    toBlock: 'latest'
  }, (error, events) => {
    const event = events[0].returnValues
    console.log(events, error)

    window.alert(`User ${event.winner} win ${web3.utils.fromWei(event.money)} Eth`)
  })

  // Error: The current provider doesn't support subscriptions: HttpProvider
  // gameInstance.events.GetWinner({}, (error, events) => {
  //   console.log(events, error)
  // })

  // -----------------------------
  // end game
  const endGame = document.getElementsByClassName('end-game')[0]
  endGame.addEventListener('click', (e) => {
    gameInstance.methods.endGame().send({
      from: web3Instance.eth.defaultAccount,
      gas: 4500000
    })
    .on('transactionHash', (hash) => {
      updateAddresses()
      syncGameStatus()
      getGamePlayers()
      console.log('end round - ', hash)
      showWinner()
    })
    .on('error', console.error)
  })
}

const makeBid = (from, to, value, bid) => gameInstance.methods.MakeBid(from, bid).send({
  from,
  to,
  value: web3.utils.toWei(value),
  gas: 4500000
})
.then((receipt) => {
  console.log('transaction done - ' + receipt)
  updateAddresses()
  syncGameStatus()

  gameInstance.methods.getPlayers().call().then((result) => {
    console.log('res -', result)
  })
})

function updateAddresses () {
  web3Instance.eth.getBalance(contractAddress).then(data => {
    const balance = document.createTextNode(web3.utils.fromWei(data))
    const item = document.getElementsByClassName('contract-balance')[0]
    item.innerHTML = ''
    item.appendChild(balance)
  })
}

function getGamePlayers () {
  gameInstance.methods.getPlayers().call().then((result) => {
    const gamePlayers = document.getElementsByClassName('game-players')[0]
    const players = result[0]
    const bids = result[1]

    players.forEach((item, index) => {
      const li = document.createElement('li')
      li.innerHTML = `${item} -  ${getHumanRedableBid(bids[index])}`
      gamePlayers.appendChild(li)
    })
  })
}

function getHumanRedableBid (value) {
  let bid = null

  switch (value) {
    case '1':
      bid = 'Rock'
      break

    case '2':
      bid = 'Paper'
      break

    case '3':
      bid = 'Scissors'
      break

    default:
      bid = 'No bid'
      break
  }

  return bid
}
