import React from 'react';

import {Box, Card, CardContent, Typography} from '@mui/material';
import {useWeb3React} from '@web3-react/core';
import {Link} from 'react-router-dom';

import {useAppSelector} from '../../../redux/hooks';
import {termsSelector} from '../../../redux/slices/stakeTerms';
import {chainHasAdvancedStaking} from '../../../services/contracts';
import {StakeType} from '../../../types/staking';

import './styles.scss';

export default function UnstakingInfo() {
    const {chainId} = useWeb3React();

    const minLockPeriod = useAppSelector(
        termsSelector(chainId!, StakeType.Classic, 'minLockPeriod'),
    );

    if (chainId === 1 && !chainHasAdvancedStaking(chainId)) {
        return (
            <Card variant="outlined" className="unstaking-info-container">
                <CardContent className="unstaking-info-card-content">
                    <Typography
                        variant="subtitle2"
                        className="unstaking-info-title"
                    >
                        All classic rewards are now redeemed on first unstake
                    </Typography>
                    <Typography className="unstaking-info-text">
                        As part of the fix for the unstaking bug on Ethereum
                        mainnet, the mechanism for claiming classic rewards has
                        changed slightly:
                    </Typography>
                    <Typography className="unstaking-info-text">
                        If you have multiple classic stakes on mainnet, you will
                        receive <strong>all</strong> of your rewards on the
                        first unstake. Any subsequent unstake will return the
                        staked amount, but no further rewards, since you will
                        have already received all the rewards.
                    </Typography>
                    <Typography className="unstaking-info-text">
                        <strong>
                            The amount of classic rewards you will receive is
                            (of course!) not changed in any way,
                        </strong>{' '}
                        only <em>when</em> you receive them. If you only have
                        one stake, this change will not affect you at all.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (!chainHasAdvancedStaking(chainId) && minLockPeriod) {
        return (
            <Box className="unstaking-info-message">
                <Typography variant="caption">
                    Classic stakes are locked for{' '}
                    {Number(minLockPeriod) / 60 / 60 / 24} days before becoming
                    eligible for unstaking. Rewards are claimed once a
                    transaction is unstaked.
                </Typography>
            </Box>
        );
    }

    return (
        <Card variant="outlined" className="unstaking-info-container">
            <CardContent className="unstaking-info-card-content">
                <Typography
                    variant="subtitle2"
                    className="unstaking-info-title"
                >
                    Advanced Unstaking
                </Typography>
                <Typography className="unstaking-info-text">
                    <span>
                        Advanced Staking locks $ZKP
                        {minLockPeriod && minLockPeriod > 0
                            ? ` for ${Math.floor(
                                  (minLockPeriod as number) / 3600 / 24,
                              )} days`
                            : ' until the fixed date defined for each stake'}
                        . The rewards are created as zZKP and PRP which can be
                        seen on the{' '}
                    </span>
                    <Link className="unstaking-info-link" to={'/zAssets'}>
                        zAsset page
                    </Link>
                    <span>.</span>
                </Typography>
            </CardContent>
        </Card>
    );
}
