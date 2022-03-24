//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Allowance.sol";

contract CustodialWallet is Allowance {
    /// @notice emitted when the contract sends funds to an address
    /// @param _receiver the receiver of the funds
    /// @param _amount the amount received
    event MoneySent(address indexed _receiver, uint256 _amount);

    /// @notice emitted when the contract receives funds from an address
    /// @param _sender the sender of the funds
    /// @param _amount the amount received
    event MoneyReceived(address indexed _sender, uint256 _amount);

    /// @notice withdraw funds from the contract
    /// @param _to the sender of the funds
    /// @param _amount the amount received
    /// @dev does not lower the owner of the contract's allowance
    /// @dev the owner will be obligated to fund this contract with ETH for users to withdraw their allowance
    function withdrawFunds(address payable _to, uint256 _amount)
        public
        ownerOrAllowed(_amount)
    {
        require(
            _amount <= address(this).balance,
            "Contract does not hold enough funds."
        );
        if (!isOwner()) {
            reduceAllowance(_to, _amount);
        }
        _to.transfer(_amount);
        emit MoneySent(_to, _amount);
    }

    /// @notice disallows renouncing ownership of the contract
    /// @dev we need an owner at all times so we can have a manager of the allowances
    function renounceOwnership() public override view onlyOwner {
        revert("Sorry, you can't renounce ownership.");
    }

    /// @notice allows the contract to accept ETH
    receive() external payable {
        emit MoneyReceived(msg.sender, msg.value);
    }
}
