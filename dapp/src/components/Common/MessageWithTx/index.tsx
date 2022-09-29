import React, {ReactElement} from 'react';

import {Typography} from '@mui/material';

import {formatAccountAddress} from '../../../services/account';
import {linkTextToTx} from '../links';

import {MessageWithTxProps} from './MessageWithTxProps.interface';

import './styles.scss';

export function MessageWithTx(props: MessageWithTxProps): ReactElement {
    const shortenAddress = formatAccountAddress(props.txHash);
    return (
        <Typography className="text-with-link">
            {props.message}&nbsp;
            {props.txHash && 'View on Block Explorer  '}
            {props.txHash &&
                linkTextToTx(
                    props.chainId,
                    props.linkText ?? shortenAddress ?? 'your transaction',
                    props.txHash,
                )}
        </Typography>
    );
}
