import * as React from 'react';

import {IconButton, Tooltip} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {BigNumber} from 'ethers';

import infoIcon from '../../../images/info-icon.svg';
import {formatCurrency} from '../../../utils/helpers';
import {SmallButton} from '../../SmallButton';

import './styles.scss';

export default function AddressBalances(props: {
    title: string;
    rewardsTokenSymbol: string;
    balance: BigNumber | null;
    amountUSD?: BigNumber | null;
    redeem?: () => void;
    tooltip?: string;
}) {
    const {title, tooltip, amountUSD, balance, rewardsTokenSymbol} = props;

    return (
        <Box className="address-balance">
            <Box className="title-box">
                <Typography className="title">{title}</Typography>
                <Typography>
                    {tooltip && (
                        <Tooltip title={tooltip} placement="top">
                            <IconButton>
                                <img src={infoIcon} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Typography>
            </Box>

            <Box className="amount-box">
                <Box className="balance-box">
                    <Typography className="balance" component="div">
                        {balance ? formatCurrency(balance) : '-'}
                    </Typography>
                    <Typography className="zkp-symbol">
                        {rewardsTokenSymbol}
                    </Typography>
                </Box>
                {amountUSD && (
                    <Typography className="amount-usd">
                        {`~$ ${formatCurrency(amountUSD)} USD`}
                    </Typography>
                )}
                {props.redeem && (
                    <SmallButton onClick={props.redeem} text={'Redeem'} />
                )}
            </Box>
        </Box>
    );
}
