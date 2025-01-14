// SPDX-License-Identifier: BUSL-1.1
// SPDX-FileCopyrightText: Copyright 2021-22 Panther Ventures Limited Gibraltar

import React from 'react';

import {WalletHeaderActionButton} from 'components/Common/WalletHeaderActionButton';
import {Link} from 'react-router-dom';

export const ContractsListButton = () => {
    return (
        <Link to="/contracts" data-testid="contract-list-button_wrapper">
            <WalletHeaderActionButton text="Contracts List" />
        </Link>
    );
};
