// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Ownable {
    address payable owner;
    constructor () {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner access.");
        _;
    }
}