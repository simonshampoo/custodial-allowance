//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Basic Allowance/Balance Implementation
/// @author Simon Shamoon
/// @notice Allowance representing each user's balance in wallet
contract Allowance is Ownable {
    /// @notice Emitted when the a address's allowance has changed
    /// @param _for the address that has their balance changed
    /// @param _by the address doing the changing (usually the owner or address itself)
    /// @param _oldAmount the previous balance
    /// @param _newAmount the new balance set
    event AllowanceChanged(
        address indexed _for,
        address indexed _by,
        uint256 _oldAmount,
        uint256 _newAmount
    );

    /// @notice holds a mapping from each user to their balance
    mapping(address => uint256) public allowance;

    /// @notice check to see if the caller is the owner of the contract
    /// @dev only for use within Allowance.sol
    /// @return whether the caller is the owner of the contract
    function isOwner() internal view returns (bool) {
        return owner() == msg.sender;
    }

    /// @notice check to see if
    /// @param _amount the amount we want to withdraw, we check to see if a user's allowance is >= than it
    /// @dev the owner() is the person who deployed the contract. We can also implement renounceOwnership() or transferOwnership()
    modifier ownerOrAllowed(uint256 _amount) {
        require(
            isOwner() || allowance[msg.sender] >= _amount,
            "Not permitted."
        );
        _;
    }

    /// @notice Sets the address with an initial balance
    /// @param _recipient the receiving address of the balance
    /// @param _amount the balance to be set
    /// @dev Only the owner (deployer) of this contract can call this function and will revert otherwise
    function setAllowance(address _recipient, uint256 _amount)
        public
        onlyOwner
    {
        emit AllowanceChanged(
            _recipient,
            msg.sender,
            allowance[_recipient],
            _amount
        );
        allowance[_recipient] = _amount;
    }

    /// @notice reduces the allowance of a certain address
    /// @param _to the address with the changed balance
    /// @param _amount the balance to be set
    /// @dev only the owner may reduce allowance
    function reduceAllowance(address _to, uint256 _amount)
        internal
        ownerOrAllowed(_amount)
    {
        emit AllowanceChanged(
            _to,
            msg.sender,
            allowance[_to],
            allowance[_to] - _amount
        );
        allowance[_to] -= _amount;
    }
}
