// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import {IAToken} from './IAToken.sol';

interface IBlastAToken {
  function claimYield(address to) external returns (uint256);
}
