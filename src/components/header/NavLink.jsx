import React from 'react';
import { pick } from '@styled-system/props';
import { Box, Text } from '../common';
import { Link } from '../../navigation/router';

const NavLink = ({ children, href, ...rest }) => {
    const wrapperProps = pick(rest);

    return (
        <Box margin="0px 25px" padding="7px 0px 0px 0px" {...wrapperProps}>
            {href ? (
                <Link to={href}>
                    <Text
                        fontWeight="bold"
                        fontSize="15"
                        color="#12243F"
                        fontFamily="Poppins">
                        {children}
                    </Text>
                </Link>
            ) : (
                <Text
                    fontWeight="regular"
                    fontSize="15"
                    color="#12243F"
                    fontFamily="Poppins">
                    {children}
                </Text>
            )}
        </Box>
    );
};

export default NavLink;
