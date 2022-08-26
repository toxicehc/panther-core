import React, {useCallback, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {useWeb3React} from '@web3-react/core';

import {useAppDispatch, useAppSelector} from '../../../redux/hooks';
import {getChainBalance} from '../../../redux/slices/chainBalance';
import {isWalletConnectedSelector} from '../../../redux/slices/isWalletConnected';
import {formatAccountAddress} from '../../../services/account';
import {
    currentNetwork,
    isWrongNetwork,
    injected,
} from '../../../services/connectors';
import {CHAIN_IDS} from '../../../services/env';
import Address from '../../Address';
import ConnectButton from '../../ConnectButton';
import {NetworkButton} from '../../NetworkButton';
import {SettingsButton} from '../../SettingsButton';
import SwitchNetworkButton from '../../SwitchNetworkButton';
import AccountBalance from '../AccountBalance';

import './styles.scss';

export default function WalletHeader() {
    const dispatch = useAppDispatch();
    const context = useWeb3React();
    const {account, active, error, chainId, activate} = context;
    const [wrongNetwork, setWrongNetwork] = useState(false);

    const network = currentNetwork(chainId);

    const fetchChainBalance = useCallback(() => {
        dispatch(getChainBalance, context);
    }, [dispatch, context]);

    const isWalletConnected = useAppSelector(isWalletConnectedSelector);

    useEffect(() => {
        const connectWalletOnPageLoad = async () => {
            if (isWalletConnected) {
                try {
                    await activate(injected);
                } catch (ex) {
                    console.error(ex);
                }
            }
        };
        connectWalletOnPageLoad();
    }, [activate, isWalletConnected]);

    useEffect((): void => {
        const wrongNetwork = isWrongNetwork(context, CHAIN_IDS);
        setWrongNetwork(wrongNetwork);

        if (!wrongNetwork && account) {
            fetchChainBalance();
        }
    }, [context, active, account, error, fetchChainBalance]);

    const accountAddress = formatAccountAddress(account) || null;

    return (
        <Grid item lg={6} md={12} xs={12} className="header-right-container">
            {/* connection button */}
            {!active && !wrongNetwork && (
                <Box className="address-btn">
                    <ConnectButton />
                </Box>
            )}

            {wrongNetwork && (
                <Box className="address-btn">
                    <SwitchNetworkButton />
                </Box>
            )}

            {/* account details */}
            {active && !wrongNetwork && (
                <>
                    {network && (
                        <NetworkButton
                            networkName={network.name}
                            networkLogo={network.logo}
                        />
                    )}
                    <Box className="address-and-balance-holder">
                        {accountAddress && (
                            <Box>
                                <Address />
                            </Box>
                        )}
                        <Box>
                            <AccountBalance networkSymbol={network?.symbol} />
                        </Box>
                    </Box>
                </>
            )}

            {/* disconnection button */}
            {active && !wrongNetwork && (
                <Box>
                    <SettingsButton />
                </Box>
            )}
        </Grid>
    );
}
