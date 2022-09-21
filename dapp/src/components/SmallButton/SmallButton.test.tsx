import * as React from 'react';

import {fireEvent, screen, waitFor} from '@testing-library/react';

import {renderComponent} from '../../utils/test-utils';

import {SmallButton} from './index';

const buttonText = 'test text';
const handleClick = jest.fn();

test('should render', () => {
    renderComponent(<SmallButton text={buttonText} onClick={handleClick} />);
    const smallButton = screen.getByTestId('small-button_holder');
    expect(smallButton).toBeInTheDocument();
});

test('click on button should trigger onClick event', () => {
    renderComponent(<SmallButton text={buttonText} onClick={handleClick} />);
    const smallButton = screen.queryByTestId('small-button_holder');
    waitFor(() => expect(smallButton).toBeInTheDocument());
    smallButton && fireEvent.click(smallButton);
    waitFor(() => expect(handleClick).toBeCalled());
});
