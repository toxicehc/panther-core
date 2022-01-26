import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './styles.scss';
import {Tooltip} from '@mui/material';

const Address = (props: {
    accountAvatar: string;
    accountAddress: string | null;
}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            width={'100%'}
        >
            <img
                src={props.accountAvatar}
                alt={'User avatar'}
                className="user-avatar-img"
            />
            <Typography
                sx={{
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px',
                    lineHeight: '42px',
                    marginLeft: '18px',
                    marginRight: '18px',
                }}
            >
                {props.accountAddress}
            </Typography>
            <Tooltip title="Copy Wallet Address" placement="top">
                <ContentCopyIcon
                    sx={{
                        opacity: 0.5,
                        width: '0.8em',
                        height: '0.8em',
                        marginRight: '18px',
                    }}
                />
            </Tooltip>
        </Box>
    );
};
export default Address;
