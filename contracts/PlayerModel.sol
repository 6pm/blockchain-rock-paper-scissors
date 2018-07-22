pragma solidity 0.4.24;

contract PlayerModel {
    // struct Player {
    //     address addr;
    //     bytes32 bid;
    // }
    
    // Player[] public players;
    
    // function getPlayers() public view returns (address[], bytes32[]) {
    //     address[] memory addrs = new address[](players.length);
    //     bytes32[] memory bids = new bytes32[](players.length);
        
    //     for (uint i = 0; i < players.length; i++) {
    //         Player storage person = players[i];
    //         addrs[i] = person.addr;
    //         bids[i] = person.bid;
    //     }
        
    //     return (addrs, bids);
    // }

    // function addPlayer() public {
    //     players.push(Player({
    //         addr: msg.sender,
    //         bid: 0
    //     }));
    // }

    address[] internal addresses;
    uint16[] internal bids;

    function getPlayers() public view returns(address[], uint16[]) {
        return (addresses, bids);
    }

    function _addPlayer(address _address, uint16 _bid) internal {
        addresses.push(_address);
        bids.push(_bid);
    }

    address[] private emtyAddresses;
    uint16[] private emptyBids;
    function _clearPlayers() internal {
        addresses = emtyAddresses;
        bids = emptyBids;
    }
}