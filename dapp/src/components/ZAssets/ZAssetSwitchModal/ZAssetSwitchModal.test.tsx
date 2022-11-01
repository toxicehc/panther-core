import * as React from 'react';

import {fireEvent, screen, waitFor} from '@testing-library/react';

import {renderComponent} from '../../../utils/test-utils';

import ZAssetSwitchModal from './index';

test('should render', async () => {
    const handleClose = jest.fn();
    renderComponent(
        <ZAssetSwitchModal open={true} closeHandler={handleClose} />,
    );

    const ZAssetSwitchModalContainer = screen.queryByTestId(
        'zassets-switch-network-modal',
    );

    await waitFor(() => expect(ZAssetSwitchModalContainer).toBeInTheDocument());
});

test('click on close should trigger onClick event', async () => {
    const handleClose = jest.fn();
    renderComponent(
        <ZAssetSwitchModal open={true} closeHandler={handleClose} />,
    );

    const closeButton = screen.queryByTestId(
        'assets-switch-network-modal-close-button',
    );

    await waitFor(() => expect(closeButton).toBeInTheDocument());
    await (closeButton && fireEvent.click(closeButton));
    await waitFor(() => expect(handleClose).toBeCalled());
});