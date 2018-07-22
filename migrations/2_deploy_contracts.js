const fs = require('fs');

// open zeppelin contracts
const Ownable = artifacts.require("./../installed_contracts/ownership/Ownable.sol");

// project contracts
const Game = artifacts.require("./../contracts/Game.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.link(Ownable, Game);
  deployer.deploy(Game)
  .then(instance => {
    const address = {
      contractAddress: Game.address,
    }
    fs.writeFile('contractAddress.json', JSON.stringify(address), (err) => {  
        if (err) throw err;

        console.log('contract address saved!');
    });
  });
};
