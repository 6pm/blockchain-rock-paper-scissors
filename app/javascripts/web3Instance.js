import Web3 from 'web3'

import contract from './../../build/contracts/Game.json'
import { contractAddress } from './../../contractAddress.json'

//  init web3
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
export const web3Instance = new Web3(provider)
window.web3 = web3Instance

export const gameInstance = new web3Instance.eth.Contract(contract.abi, contractAddress)
