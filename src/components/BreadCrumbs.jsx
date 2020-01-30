import React, { Component } from 'react';
import { Box, Text } from './common';
import { Link } from '../navigation/router';

const BreadCrumbLink = ({ link, isLast }) => (
    <Box mx="2px" display="flex" flexDirection="row" alignItems="center">
        <Link to={`/${link}`}>
            <Text
                mx="8px"
                color={!isLast ? '#58595B' : '#234385'}
                fontSize="15px"
                texttransform="capitalize">
                {link}
            </Text>
        </Link>
        {!isLast && (
            <Box pt="2px">
                <Text fontSize="12px">{`/`}</Text>
            </Box>
        )}
    </Box>
);

const BreadCrumbs = ({ title, links }) => {
    console.log(links);
    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            pt="25px"
            px="50px">
            {links.map((link, index) => {
                if (link)
                    return (
                        <BreadCrumbLink
                            key={`${link}-${index}`}
                            link={link}
                            isLast={index === links.length - 1}
                        />
                    );
            })}
        </Box>
    );
};

export default BreadCrumbs;
