// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: Copyright 2021-22 Panther Ventures Limited Gibraltar
// solhint-disable-next-line compiler-fixed, compiler-gt-0_8
pragma solidity ^0.8.0;

import "./TransferHelper.sol";

/**
 * @title Claimable
 * @notice It withdraws accidentally sent tokens or ETH from this contract.
 */
abstract contract Claimable {
    /// @dev Withdraws ERC20 tokens from this contract
    /// (take care of reentrancy attack risk mitigation)
    function _claimEthOrErc20(
        address token,
        address to,
        uint256 amount
    ) internal {
        if (token == address(0)) {
            // withdraw ETH
            TransferHelper.safeTransferETH(to, amount);
        } else {
            // withdraw ERC20
            TransferHelper.safeTransfer(token, to, amount);
        }
    }
}