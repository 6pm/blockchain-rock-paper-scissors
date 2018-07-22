import store from '../../store'
import Web3 from 'web3'

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  }
}

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function(dispatch) {
    var results
    var web3Instance = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    // if (typeof web3 !== 'undefined') {
    //   // Use Mist/MetaMask's provider.
    //   web3 = new Web3(web3.currentProvider)

    //   results = {
    //     web3Instance: web3
    //   }
    //   console.log('Injected web3 detected.');

    //   resolve(store.dispatch(web3Initialized(results)))
    // } else {

      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
      web3Instance = new Web3(provider)
      web3Instance.eth.defaultAccount = '0x943Ad938F890a5aAFb0Aa1F1F2f25F956593A24c'
      // web3Instance.eth.accounts.privateKeyToAccount('e3e46aac955ce8d302eff7f0807cf9023f8c810b8670f0b2bebbeb24dcf6c5fb')
      

      // web3Instance.eth.getAccounts(console.log);

      console.log(web3Instance.eth.getTransactionCount('0x4e5F10D1419E73dd7caB9c95E6649719777b94D8'));

      // web3Instance.eth.isSyncing().then(console.log);

      web3Instance.eth.isMining().then(console.log);

      web3Instance.eth.getHashrate().then(console.log);

    // using the promise
    web3Instance.eth.sendTransaction({
      // from: '0x943Ad938F890a5aAFb0Aa1F1F2f25F956593A24c',
      to: '0x4e5F10D1419E73dd7caB9c95E6649719777b94D8',
      value: '111000000000000000',
    })
    .then(function(receipt){
      debugger
    });
    
    

      results = {
        web3Instance: web3Instance
      }

      console.log('No web3 instance injected, using Local web3.');

      resolve(store.dispatch(web3Initialized(results)))
    // }
  })
})

export default getWeb3
