// SPDX-License-Identifier: BUSL-1.1
// SPDX-FileCopyrightText: Copyright 2021-22 Panther Ventures Limited Gibraltar

import {useCallback, useEffect} from 'react';
import * as React from 'react';

import {Box} from '@mui/material';
import {useWeb3React} from '@web3-react/core';
import {MessageWithTx} from 'components/Common/MessageWithTx';
import {
    removeNotification,
    openNotification,
} from 'components/Common/notification';
import {expectedPrpBalanceTooltip} from 'components/Common/tooltips';
import {BigNumber} from 'ethers';
import infoIcon from 'images/info-icon.svg';
import {awaitConfirmationAndRetrieveEvent} from 'lib/events';
import {useAppDispatch} from 'redux/hooks';
import {getStakes, useStakes} from 'redux/slices/staking/stakes';
import {getTotalUnclaimedClassicRewards} from 'redux/slices/staking/total-unclaimed-classic-rewards';
import {getTotalsOfAdvancedStakes} from 'redux/slices/staking/totals-of-advanced-stakes';
import {getZkpStakedBalance} from 'redux/slices/staking/zkp-staked-balance';
import {
    registerWalletActionFailure,
    registerWalletActionSuccess,
    startWalletAction,
    StartWalletActionPayload,
    WalletActionTrigger,
} from 'redux/slices/ui/web3-wallet-last-action';
import {getChainBalance} from 'redux/slices/wallet/chain-balance';
import {getZkpTokenBalance} from 'redux/slices/wallet/zkp-token-balance';
import {parseTxErrorMessage} from 'services/errors';
import {StakeRow, unstake} from 'services/staking';

import UnstakeRow from './UnstakeRow';

import './styles.scss';

async function unstakeWithNotification(
    library: any,
    chainId: number,
    account: string,
    stakeID: BigNumber,
    data: string | undefined,
) {
    const [tx, err] = await unstake(
        library,
        chainId,
        account,
        stakeID,
        data,
        false,
    );

    if (err) {
        openNotification(
            'Transaction error',
            <MessageWithTx
                message={parseTxErrorMessage(err)}
                chainId={chainId}
                txHash={tx?.hash}
            />,
            'danger',
        );
        return err;
    }

    const inProgress = openNotification(
        'Transaction in progress',
        <MessageWithTx
            message="Your unstaking transaction is currently in progress. Please wait for confirmation!"
            chainId={chainId}
            txHash={tx?.hash}
        />,

        'info',
    );

    const event = await awaitConfirmationAndRetrieveEvent(tx, 'StakeClaimed');
    removeNotification(inProgress);

    if (event instanceof Error) {
        openNotification(
            'Transaction error',
            <MessageWithTx
                message={parseTxErrorMessage(event)}
                txHash={tx?.hash}
                chainId={chainId}
            />,
            'danger',
        );
        return err;
    }

    openNotification(
        'Unstaking completed successfully',
        <MessageWithTx
            message="Congratulations! Your unstaking transaction was processed!"
            txHash={tx?.hash}
            chainId={chainId}
        />,

        'info',
        10000,
    );
}

export default function UnstakeTable() {
    const context = useWeb3React();
    const {library, chainId, account} = context;
    const dispatch = useAppDispatch();
    const {stakes} = useStakes();

    const unstakeById = useCallback(
        async (id, trigger: WalletActionTrigger) => {
            if (!library || !chainId || !account) {
                return;
            }
            dispatch(startWalletAction, {
                name: 'signMessage',
                cause: {caller: 'UnstakeTab', trigger},
                data: {account},
            } as StartWalletActionPayload);

            const stakeID = BigNumber.from(id);
            const data = '0x00';

            const response = await unstakeWithNotification(
                library,
                chainId,
                account,
                stakeID,
                data,
            );
            if (response !== undefined) {
                dispatch(registerWalletActionFailure, 'signMessage');
                return;
            }
            dispatch(registerWalletActionSuccess, 'signMessage');

            dispatch(getTotalsOfAdvancedStakes, context);
            dispatch(getZkpStakedBalance, context);
            dispatch(getTotalUnclaimedClassicRewards, context);
            dispatch(getZkpTokenBalance, context);
            dispatch(getChainBalance, context);
            dispatch(getStakes, context);
        },
        [library, chainId, account, context, dispatch],
    );

    useEffect(() => {
        dispatch(getStakes, context);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [library, chainId, account]);

    return (
        <Box
            className="unstake-table"
            data-testid="unstake-table_unstake-table_container"
        >
            {stakedData.map(row => (
                <UnstakeRow
                    key={row.stakedAt}
                    row={row}
                    unstakeById={unstakeById}
                    chainId={chainId}
                />
            ))}
        </Box>
    );
}
