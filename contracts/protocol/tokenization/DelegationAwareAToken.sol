// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.12;

import {VennFirewallConsumer} from "@ironblocks/firewall-consumer/contracts/consumers/VennFirewallConsumer.sol";
import {IPool} from '../../interfaces/IPool.sol';
import {IDelegationToken} from '../../interfaces/IDelegationToken.sol';
import {AToken} from './AToken.sol';
import {Context} from '@openzeppelin/contracts/utils/Context.sol';
/**
 * @title DelegationAwareAToken
 * @author Aave
 * @notice AToken enabled to delegate voting power of the underlying asset to a different address
 * @dev The underlying asset needs to be compatible with the COMP delegation interface
 */
contract DelegationAwareAToken is VennFirewallConsumer, AToken {
  /**
   * @dev Emitted when underlying voting power is delegated
   * @param delegatee The address of the delegatee
   */
  event DelegateUnderlyingTo(address indexed delegatee);

  /**
   * @dev Constructor.
   * @param pool The address of the Pool contract
   */
  constructor(IPool pool) AToken(pool) {
    // Intentionally left blank
  }

  /**
   * @notice Delegates voting power of the underlying asset to a `delegatee` address
   * @param delegatee The address that will receive the delegation
   */
  function delegateUnderlyingTo(address delegatee) external onlyPoolAdmin firewallProtected {
    IDelegationToken(_underlyingAsset).delegate(delegatee);
    emit DelegateUnderlyingTo(delegatee);
  }

  function _msgSender() internal view virtual override(AToken, Context) returns (address) {
    return super._msgSender();
  }

  function _msgData() internal view virtual override(AToken, Context) returns (bytes calldata) {
    return super._msgData();
  }
}
