import * as React from 'react';
import {useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useWeb3React} from '@web3-react/core';

import {useAppSelector, useAppDispatch} from '../../../../../redux/hooks';
import {advancedStakesRewardsSelector} from '../../../../../redux/slices/advancedStakesRewards';
import {getPoolV0ExitTime} from '../../../../../redux/slices/poolV0';
import {AdvancedStakeRewards, UTXOStatus} from '../../../../../types/staking';

import AssetsDetailsRow from './AssetsDetailsRow';

import './styles.scss';

const AssetsDetailsTable = () => {
    const context = useWeb3React();
    const {account, chainId, library} = context;
    const advancedStakesRewards = useAppSelector(
        advancedStakesRewardsSelector(chainId, account),
    );
    const dispatch = useAppDispatch();
    const [gotExitTime, registerExitTimeCall] = useState<boolean>(false);

    useEffect(() => {
        if (gotExitTime || !chainId || !library) return;
        dispatch(getPoolV0ExitTime, context);
        registerExitTimeCall(true);
    }, [context, chainId, library, dispatch, gotExitTime]);

    return (
        <Box sx={{margin: 1}}>
            <Table size="small" aria-label="purchases">
                <TableHead>
                    <TableRow className="staked-zAsset-row">
                        <TableCell>Date:</TableCell>
                        <TableCell>Type:</TableCell>
                        <TableCell align="right">Amount:</TableCell>
                        <TableCell align="right">Rewards Earned:</TableCell>
                        <TableCell align="right">APY:</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(advancedStakesRewards)
                        .filter((rewards: AdvancedStakeRewards) =>
                            [UTXOStatus.UNDEFINED, UTXOStatus.UNSPENT].includes(
                                rewards.utxoStatus,
                            ),
                        )
                        .map((rewards: AdvancedStakeRewards, key: number) => (
                            <AssetsDetailsRow rewards={rewards} key={key} />
                        ))}
                </TableBody>
            </Table>
        </Box>
    );
};
export default AssetsDetailsTable;
