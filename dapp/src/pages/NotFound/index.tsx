import React from 'react';

import {Container, Typography} from '@mui/material';
import {Link} from 'react-router-dom';

import {MainPageWrapper} from '../../components/MainPageWrapper';

const NotFoundPage = () => {
    return (
        <MainPageWrapper>
            <Container>
                <Typography color="white" fontSize={34}>
                    Page Not Found
                </Typography>
                <Typography color="white" fontSize={24} marginBottom={5}>
                    Oops! Sorry, it looks like this Panther got a bit lost.
                </Typography>
                <Typography>
                    <Link to="/">Return to the home page</Link>
                </Typography>
            </Container>
        </MainPageWrapper>
    );
};

export default NotFoundPage;
