pragma solidity 0.4.24;

import "./../installed_contracts/ownership/Ownable.sol";
import "./PlayerModel.sol";
import "./GameStages.sol";


contract Game is Ownable, PlayerModel, GameStages {
    uint private endTime = 0;
    uint public joinPrice = 0;

    // events not works on web3 1.0.0 with httpProvider
    event GetWinner(address winner, uint money);

    // -----------------------------------------
    // modifiers
    modifier paymentIsValid() {
        require(msg.value > 0.5 ether);
        require(msg.value < 50 ether);
        _;
    }

    modifier roundEnded() {
        require(block.timestamp > endTime);
        _;
    }

    modifier roundStarted() {
        require(endTime != 0);
        _;
    }

    // -----------------------------------------
    // PUBLIC INTERFACE

    // Accumulate some deposit
    function() public payable {}

    // Accumulate deposit from bids
    function MakeBid(address _address, uint16 _bid) public payable paymentIsValid {
        if(atStage(Stages.NotStarted)) {
            _startRound();
        }

        _addPlayer(_address, _bid);
    }

    function endGame() public roundEnded returns(uint) {
        uint fee = _getFee();
        uint prize = this.balance - fee;
        address winner = _getWinnerAddress();

        winner.transfer(prize);
        owner.transfer(this.balance);
        emit GetWinner(winner, prize);
        
        _clearRound();
    }
    // -----------------------------------------
    // internal methods

    function _startRound() internal {
        joinPrice = msg.value;
        endTime = block.timestamp + 3 minutes;
        nextStage();
    }

    function _clearRound() private {
        backToStartStage();
        _clearPlayers();
        endTime = 0;
        joinPrice = 0;
    }

    function _getFee() private returns(uint) {
        // fee is 10%
        return this.balance / 10;
    }

    function _getWinnerPrize(uint _fee) private returns(uint) {
        return this.balance - _fee;
    }

    function _getWinnerAddress() private returns(address) {
        uint winIndex = 0;

        for (uint currentIndex = 1; currentIndex < bids.length; currentIndex++) {
            winIndex = _compareTwoBidsByIndex(winIndex, currentIndex);
        }

        return addresses[winIndex];
    }
    
    function _compareTwoBidsByIndex(uint index1, uint index2) private returns (uint) {
        // rock -     1
        // paper -    2
        // scissors - 3
        // algorithm - https://gist.github.com/joshfry/7327656
        
        uint16 bid1 = bids[index1];
        uint16 bid2 = bids[index2];


        if(bid1 == bid2) {
            // @todo - get random winner
            return index1;
        }

        if(bid1 == 1) {
            if(bid2 == 3) {
                return index1;
            }
            else {
                return index2;
            }
        }
        else if(bid1 == 2) {
            if(bid2 == 1) {
                return index1;   
            }
            else {
                return index2;     
            }
        }
        else if(bid1 == 3) {
            if(bid2 == 1) {
                return index2;
            }
            else {
                return index1;  
            }
        }
    }

    // ---------

    // function _generateRandom() private view returns (uint) {
    //     uint rand = uint(keccak256(abi.encodePacked(block.timestamp)));
    //     return rand % 1;
    // }

}
