// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Ownable.sol";

contract DistributeFunding is Ownable{
    struct beneficiary{
        address payable addr;
        uint ratio;
    }
    
    beneficiary[] private beneficiaries;
    
    event added(address identifier, uint ratio);
    event routed(address identifier, uint amount);
    
    function add(address payable _beneficiary, uint _ratio) external onlyOwner {
        beneficiary memory b = beneficiary({addr: _beneficiary, ratio: _ratio});
        emit added(_beneficiary, _ratio);
        beneficiaries.push(b);
    }
    
    function distribute() public payable {
        for(uint i = 0 ;i < beneficiaries.length; i++){
            uint amount = beneficiaries[i].ratio * 100 / msg.value;
            beneficiaries[i].addr.call {gas : amount};
            emit routed(beneficiaries[i].addr, amount);
        }
    }
    
    receive() external payable {
        distribute();
    }
}