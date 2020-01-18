import React, { Component } from 'react';
import { View, ViewPropTypes } from 'react-native';
import { Box } from '../common/Box';
import { pick } from '@styled-system/props';

export class Table extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        borderStyle: ViewPropTypes.style,
    };

    _renderChildren(props) {
        return React.Children.map(props.children, (child, i) => {
            return React.cloneElement(
                child,
                props.borderStyle && child.type.displayName !== 'ScrollView'
                    ? {
                          borderStyle: {
                              ...props.borderStyle,
                              ...child.props.borderStyle,
                          },
                      }
                    : {}
            );
        });
    }

    render() {
        const { borderStyle, ...rest } = this.props;
        const borderLeftWidth = (borderStyle && borderStyle.borderWidth) || 0;
        const borderBottomWidth = borderLeftWidth;
        const borderColor = (borderStyle && borderStyle.borderColor) || '#000';
        const wrapperProps = pick(rest);

        return <Box {...wrapperProps}>{this._renderChildren(this.props)}</Box>;
    }
}

export class TableWrapper extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
    };

    _renderChildren(props) {
        return React.Children.map(props.children, (child, index) =>
            React.cloneElement(
                child,
                props.borderStyle
                    ? {
                          borderStyle: props.borderStyle,
                      }
                    : {}
            )
        );
    }

    render() {
        const { style } = this.props;
        return <View style={style}>{this._renderChildren(this.props)}</View>;
    }
}
