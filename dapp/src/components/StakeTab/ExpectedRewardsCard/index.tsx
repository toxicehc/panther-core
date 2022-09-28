import * as React from 'react';

import {IconButton} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {BigNumber, constants} from 'ethers';

import questionmarkIcon from '../../../images/questionmark-icon.svg';
import {formatCurrency} from '../../../lib/format';
import {useAppSelector} from '../../../redux/hooks';
import {calculatedRewardsSelector} from '../../../redux/slices/advancedStakePredictedRewards';
import {remainingPrpRewardsSelector} from '../../../redux/slices/remainingPrpRewards';
import {StakingRewardTokenID} from '../../../types/staking';

import './styles.scss';

function expectedPrpRewards(
    predictedRewardsBN: BigNumber | null | undefined,
    remainingRewardsBN: BigNumber | null,
): BigNumber {
    if (!remainingRewardsBN || !predictedRewardsBN) return constants.Zero;
    return remainingRewardsBN.lt(predictedRewardsBN)
        ? remainingRewardsBN
        : predictedRewardsBN;
}

export function ExpectedRewardsCard() {
    const rewards = useAppSelector(calculatedRewardsSelector);
    const zZkpBN = rewards?.[StakingRewardTokenID.zZKP];
    const predictedRewardsBN = rewards?.[StakingRewardTokenID.PRP];
    const remainingRewardsBN = useAppSelector(remainingPrpRewardsSelector);

    const prpBN: BigNumber = expectedPrpRewards(
        predictedRewardsBN,
        remainingRewardsBN,
    );

    return (
        <Box className="expected-rewards-card">
            <Typography className="expected-rewards-card-title">
                Your Expected Advanced Staking Rewards:
            </Typography>
            <Box className="expected-rewards-card-container">
                <Box className="expected-rewards-card-content">
                    <Typography className="title">
                        ZKP Staking Reward:
                        <IconButton>
                            <img src={questionmarkIcon} />
                        </IconButton>
                    </Typography>
                    <Typography className="amount">
                        {zZkpBN ? `${formatCurrency(zZkpBN)} zZKP` : '-'}
                    </Typography>
                </Box>
                <Box className="expected-rewards-card-content">
                    <Typography className="title">
                        Privacy Reward Points:
                        <IconButton>
                            <img src={questionmarkIcon} />
                        </IconButton>
                    </Typography>

                    <Typography className="amount">
                        {`${formatCurrency(prpBN, {
                            decimals: 0,
                            scale: 0,
                        })}
                            PRP`}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
