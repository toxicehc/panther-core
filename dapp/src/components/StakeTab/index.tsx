import {useCallback, useEffect, useState} from 'react';
import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {NoEthereumProviderError} from '@web3-react/injected-connector';
import {BigNumber, utils} from 'ethers';

import StakingInfo from '../../components/StakeTab/StakingInfo';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {calculateRewards} from '../../redux/slices/advancedStakePredictedRewards';
import {
    isStakingOpenSelector,
    termsSelector,
} from '../../redux/slices/stakeTerms';
import {getTotalStaked} from '../../redux/slices/totalStaked';
import {getUnclaimedRewards} from '../../redux/slices/unclaimedStakesRewards';
import {getZkpStakedBalance} from '../../redux/slices/zkpStakedBalance';
import {
    zkpTokenBalanceSelector,
    getZkpTokenBalance,
} from '../../redux/slices/zkpTokenBalance';
import {onWrongNetwork} from '../../services/connectors';
import {CHAIN_IDS} from '../../services/env';
import {advancedStake} from '../../services/staking';
import {StakeType} from '../../types/staking';
import {safeParseUnits} from '../../utils/helpers';
import {safeOpenMetamask} from '../Common/links';
import {ConnectButton} from '../ConnectButton';

import {ExpectedRewardsCard} from './ExpectedRewardsCard';
import StakingBtn from './StakingBtn';
import StakingInput from './StakingInput';

import './styles.scss';

export default function StakeTab(props: {
    onConnect: any;
    networkLogo?: string;
    switchNetwork: any;
    stakeType: string;
}) {
    const context = useWeb3React();
    const {account, library, chainId, active, error} = context;
    const tokenBalance = useAppSelector(zkpTokenBalanceSelector);
    const minStake = useAppSelector(
        termsSelector(chainId, StakeType.Advanced, 'minAmountScaled'),
    );
    const isStakingOpen = useAppSelector(
        isStakingOpenSelector(chainId, StakeType.Advanced),
    );

    const dispatch = useAppDispatch();
    const isNoEthereumProviderError = error instanceof NoEthereumProviderError;
    const [wrongNetwork, setWrongNetwork] = useState(false);
    const [amountToStake, setAmountToStake] = useState<string>('');
    const [amountToStakeBN, setAmountToStakeBN] = useState<BigNumber | null>(
        null,
    );
    const [, setStakedId] = useState<number | null>(null);

    // For use when user types input
    const setStakingAmount = useCallback(
        (amount: string) => {
            setAmountToStake(amount);
            const bn = safeParseUnits(amount);
            if (bn) {
                setAmountToStakeBN(bn);
                dispatch(calculateRewards, bn.toString());
            }
        },
        [dispatch],
    );

    // For use when user clicks Max button
    const setStakingAmountBN = useCallback((amountBN: BigNumber) => {
        const amount = utils.formatEther(amountBN);
        setAmountToStake(amount);
        setAmountToStakeBN(amountBN);
    }, []);

    const stake = useCallback(
        async (amount: BigNumber) => {
            if (!chainId || !account || !tokenBalance) {
                return;
            }

            const stakingResponse = await advancedStake(
                library,
                chainId,
                account,
                amount,
            );

            if (stakingResponse instanceof Error) {
                return;
            }
            setStakedId(Number(stakingResponse));
            setStakingAmount('');
            dispatch(getTotalStaked, context);
            dispatch(getZkpStakedBalance, context);
            dispatch(getZkpTokenBalance, context);
            dispatch(getUnclaimedRewards, context);
        },
        [
            library,
            account,
            chainId,
            setStakingAmount,
            context,
            dispatch,
            tokenBalance,
        ],
    );

    useEffect((): any => {
        const wrongNetwork =
            onWrongNetwork(context) || error instanceof UnsupportedChainIdError;
        setWrongNetwork(wrongNetwork);
        console.debug(
            'header: wrongNetwork',
            wrongNetwork,
            '/ active',
            active,
            '/ error',
            error,
        );
        if (wrongNetwork) {
            return;
        }

        if (account && library) {
            let stale = false;

            library.getBalance(account).then(() => {
                if (!stale) {
                    setWrongNetwork(onWrongNetwork(context));
                }
            });

            return () => {
                stale = true;
            };
        }
    }, [context, active, account, library, error]);

    return (
        <Box className="staking-tab-holder">
            {isStakingOpen ? (
                <>
                    <StakingInput
                        setStakingAmount={setStakingAmount}
                        setStakingAmountBN={setStakingAmountBN}
                        amountToStake={amountToStake}
                        networkLogo={props.networkLogo}
                    />
                    <Card variant="outlined" className="staking-info-card">
                        <CardContent className="staking-info-card-content">
                            <StakingInfo />

                            <ExpectedRewardsCard />
                        </CardContent>
                    </Card>
                </>
            ) : (
                <StakingInfo />
            )}

            {wrongNetwork && (
                <div className="buttons-holder">
                    <ConnectButton
                        text={'Switch network'}
                        onClick={() => {
                            const chainIdToSwitch = chainId
                                ? chainId
                                : CHAIN_IDS[0];
                            props.switchNetwork(chainIdToSwitch);
                        }}
                    />
                </div>
            )}

            {!active && !wrongNetwork && (
                <div className="buttons-holder">
                    <ConnectButton
                        text={
                            isNoEthereumProviderError
                                ? 'Install MetaMask'
                                : 'Connect Wallet'
                        }
                        onClick={() => {
                            if (isNoEthereumProviderError) {
                                safeOpenMetamask();
                            } else {
                                props.onConnect();
                            }
                        }}
                    />
                </div>
            )}

            {isStakingOpen && active && !wrongNetwork && (
                <StakingBtn
                    amountToStake={amountToStake}
                    amountToStakeBN={amountToStakeBN}
                    stake={stake}
                    tokenBalance={tokenBalance}
                    minStake={minStake as number}
                />
            )}
        </Box>
    );
}
