pragma solidity 0.4.24;

contract GameStages {
    enum Stages {
        NotStarted,
        Started
    }
    // This is the current stage.
    Stages public stage = Stages.NotStarted;

    function atStage(Stages _stage) public returns (bool) {
        return (stage == _stage) ? true : false;
    }

    function nextStage() public {
        stage = Stages(uint(stage) + 1);
    }

    function getStage() public returns (Stages) {
        return stage;    
    }

    function backToStartStage() public returns (Stages) {
        stage = Stages.NotStarted;
    }
}
