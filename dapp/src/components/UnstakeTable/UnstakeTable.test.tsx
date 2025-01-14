// SPDX-License-Identifier: BUSL-1.1
// SPDX-FileCopyrightText: Copyright 2021-22 Panther Ventures Limited Gibraltar

import * as React from 'react';

import {screen, waitFor} from '@testing-library/react';
import {renderComponent} from 'components/Common/test-utils';

import UnstakeTable from './index';

test('should render with its child components', () => {
    renderComponent(<UnstakeTable />);
    const unstakeTable = screen.queryByTestId(
        'unstake-table_unstake-table_container',
    );
    const unstakeButton = screen.queryByTestId(
        'unstake-table_unstake-button_container',
    );

    waitFor(() => {
        expect(unstakeTable).toBeInTheDocument();
        expect(unstakeButton).toBeInTheDocument();
    });

    const unstakeButtonTexts = ['Unstake', 'Locked Until:'];
    const buttonText = unstakeButton && unstakeButton.innerHTML;

    waitFor(() => {
        expect(unstakeButtonTexts).toContain(buttonText);
    });
});
