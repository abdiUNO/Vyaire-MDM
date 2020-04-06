import React, { Component } from 'react';
import { Box, Text } from './common';
import { Link } from '../navigation/router';

const BreadCrumbLink = ({ link, path, isLast }) => (
    <Box mx="2px" display="flex" flexDirection="row" alignItems="center">
        {path ? (
            <Link to={`${path}`}>
                <Text
                    mx="12px"
                    fontWeight="500"
                    color={!isLast ? '#58595B' : '#234385'}
                    fontSize="15px"
                    texttransform="capitalize">
                    {link}
                </Text>
            </Link>
        ) : (
            <Text
                mx="12px"
                fontWeight="500"
                color={!isLast ? '#58595B' : '#234385'}
                fontSize="15px"
                texttransform="capitalize">
                {link}
            </Text>
        )}
        {!isLast && (
            <Box pt="2px">
                <Text fontSize="12px">{`/`}</Text>
            </Box>
        )}
    </Box>
);

const BreadCrumbs = ({ title, currentPath, blacklist, links }) => {
    const defaultList = [
        'pricing',
        'global-trade',
        'customer-master',
        'credit-form',
        'contracts',
    ];
    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            pt="25px"
            px="50px">
            {links.map((link, index) => {
                const path = links.slice(0, index + 1).join('/');
                if (
                    blacklist.length <= 0 ||
                    blacklist.some((el) => el !== link)
                )
                    if (defaultList.some((el) => el === link))
                        return (
                            <BreadCrumbLink
                                key={`${link}-${index}`}
                                link={link}
                                isLast={index === links.length - 1}
                            />
                        );
                    else if (
                        blacklist.length <= 0 ||
                        blacklist.some((el) => el !== link)
                    )
                        if (link)
                            return (
                                <BreadCrumbLink
                                    key={`${link}-${index}`}
                                    link={link}
                                    path={path !== currentPath ? path : null}
                                    isLast={index === links.length - 1}
                                />
                            );
            })}
        </Box>
    );
};

export default BreadCrumbs;
