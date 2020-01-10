import React from 'react';
import { Cell } from './Cell';
import { Link } from '../../navigation/router';

export const Row = ({ children, style, dataArr, odd }) => (
    <tr style={style}>
        {dataArr.map((value, index) => {
            if (index === 0)
                return (
                    <Cell
                        key={index}
                        odd={odd}
                        style={{
                            paddingLeft: index === 0 ? 20 : 16,
                            paddingRight: 12,
                            borderRightWidth:
                                index === dataArr.length - 1 ? 0 : 1,
                        }}>
                        <Link
                            to={{
                                pathname: `/customers/${value}`,
                                data: {},
                            }}>
                            {value}
                        </Link>
                    </Cell>
                );
            else
                return (
                    <Cell
                        key={index}
                        odd={odd}
                        style={{
                            paddingLeft: index === 0 ? 20 : 16,
                            paddingRight: 12,
                            borderRightWidth:
                                index === dataArr.length - 1 ? 0 : 1,
                        }}>
                        {value}
                    </Cell>
                );
        })}
    </tr>
);
