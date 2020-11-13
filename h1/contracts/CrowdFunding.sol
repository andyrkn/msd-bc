// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Ownable.sol";

contract CrowdFunding is Ownable {
    uint goal;
    struct contributor {
        address identifier;
        uint amount;
    }

    contributor[] private contributors;

    constructor(uint _goal){
        goal = _goal;
    }

    modifier canContribute() {
        require(msg.value > 0, "Cannot contribute invalid amounts");
        require(amountContributed() < goal, "Goal already reached");
        _;
    }

    event contributed(address identifier, uint amount);
    event retracted(address identifier, uint amount);
    event paidOut(address identifier, uint amount);

    function contribute() external payable canContribute returns(bool) {
        
        for(uint i = 0; i < contributors.length; i++) {
            if(contributors[i].identifier == msg.sender){
                contributors[i].amount += msg.value;
                emit contributed(msg.sender, msg.value);
                return true;
            }
        }

        contributor memory c = contributor({identifier: msg.sender, amount: msg.value});
        contributors.push(c);
        emit contributed(msg.sender, msg.value);
        return true;
    }

    function retract(uint _amount) external payable canContribute returns(bool) {

        for(uint i = 0; i < contributors.length; i++) {
            if(contributors[i].identifier == msg.sender) {
                require(contributors[i].amount >= _amount, "Can't retract more than contributed");
                if(contributors[i].amount == _amount){
                    contributors[i] = contributors[contributors.length - 1];
                    contributors.pop();
                    msg.sender.transfer(_amount);
                    emit retracted(msg.sender, _amount);
                    return true;
                }
                contributors[i].amount -= _amount;
                msg.sender.transfer(_amount);
                emit retracted(msg.sender, _amount);
                return true;
            }
        }
        return false;
    }

    function sendAway(address payable receiver) external onlyOwner {
            require(amountContributed() >= goal, "Can only route money after goal is achieved");
            
            receiver.transfer(amountContributed());
            emit paidOut(receiver, amountContributed());
            delete contributors;
    }

    function amountContributed() public view returns(uint) {
        uint sum = 0;
        for(uint i = 0; i < contributors.length; i++) {
            sum = sum + contributors[i].amount;
        }
        return sum;
    }

    function crowdFundingStatus() external view returns(uint) {
        return amountContributed();
    }

    function getGoal() external view returns(uint){
        return goal;
    }
}