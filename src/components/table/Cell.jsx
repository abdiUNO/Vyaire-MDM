import React from 'react';

export const HeadCell = ({ children, rowSpan, style }) => (
    <th
        rowSpan={rowSpan}
        style={{
            fontSize: 16,
            borderCollapse: 'collapse',
            borderSpacing: 0,
            borderRightWidth: 1,
            borderColor: '#98D7DA',
            borderRightStyle: 'solid',
            paddingTop: 24,
            paddingBottom: 24,
            paddingHorizontal: 15,
            paddingLeft: 14,
            paddingRight: 16,
            textAlign: 'left',
            verticalAlign: 'top',
            ...style,
        }}>
        {children}
    </th>
);

export const Cell = ({ children, style, odd }) => (
    <td
        style={{
            borderCollapse: 'collapse',
            borderRightWidth: 1,
            borderColor: '#98D7DA',
            borderRightStyle: 'solid',
            borderSpacing: 0,
            paddingTop: 26,
            paddingBottom: 27,
            textAlign: 'left',
            verticalAlign: 'top',
            backgroundColor: odd ? '#F8F8F8' : '#FFF',
            ...style,
        }}>
        {children}
    </td>
);
