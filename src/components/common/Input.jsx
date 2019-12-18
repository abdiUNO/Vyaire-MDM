import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Text,
    Platform,
} from 'react-native';

import { TextInput } from 'react-native-web';
import { FontAwesome } from '@expo/vector-icons';

class Input extends React.Component {
    inputRef;

    constructor(props) {
        super(props);

        // todos: remove focused in next major version.
        this.state = {
            focused: props.focused || false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.focused !== this.state.focused) {
            this.setState({
                focused: nextProps.focused,
            });
        }
    }

    componentDidMount() {
        if (this.inputRef && (this.props.autoFocus || this.props.focused)) {
            this.inputRef.focus();
        }
    }

    componentDidUpdate() {
        if (this.inputRef && this.props.focused) {
            this.inputRef.focus();
        }
    }

    focus = () => {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    };

    clear = () => {
        if (this.inputRef) {
            this.inputRef.clear();
        }
    };

    render() {
        return (
            <TextInput
                ref={el => (this.inputRef = el)}
                underlineColorAndroid="transparent"
                {...this.props}
            />
        );
    }
}

function normalizeValue(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }
    return value;
}

const noop = () => {};

class InputItem extends Component {
    static defaultProps = {
        type: 'text',
        editable: true,
        clear: false,
        onChange: noop,
        onBlur: noop,
        onFocus: noop,
        extra: '',
        onExtraClick: noop,
        error: false,
        onErrorClick: noop,
        labelNumber: 4,
        last: false,
    };

    state = {
        focus: false,
    };
    inputRef = Input;

    onChange = text => {
        const { onChange, type } = this.props;

        if (onChange) {
            onChange(text);
        }
    };

    onInputBlur = () => {
        this.setState({ focus: false }, () => {
            if (this.props.onBlur) {
                this.props.onBlur(this.props.value);
            }
        });
    };

    onInputFocus = () => {
        this.setState({ focus: true }, () => {
            if (this.props.onFocus) {
                this.props.onFocus(this.props.value);
            }
        });
    };

    onInputClear = () => {
        if (this.inputRef) {
            this.inputRef.clear();
        }
        this.onChange('');
    };

    // this is instance method for user to use
    focus = () => {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    };

    render() {
        const android = Platform.OS === 'android';
        const {
            type,
            editable,
            clear,
            children,
            error,
            extra,
            labelNumber,
            last,
            onExtraClick,
            onErrorClick,
            styles,
            disabled,
            leftIcon,
            ...restProps
        } = this.props;
        const { focus } = this.state;
        const { value, defaultValue, style } = restProps;
        let valueProps = {};
        if ('value' in this.props) {
            valueProps = {
                value: normalizeValue(value),
            };
        } else {
            valueProps = {
                defaultValue,
            };
        }

        const containerStyle = {
            flex: 1,
            flexDirection: 'column',
            ...this.props.containerstyle,
        };

        const textStyle = {
            width: 17 * labelNumber * 1.05,
        };

        const extraStyle = {
            width:
                typeof extra === 'string' && extra.length > 0
                    ? extra.length * 17
                    : 0,
        };

        const keyboardTypeArray = [
            'default',
            'email-address',
            'numeric',
            'phone-pad',
            'ascii-capable',
            'numbers-and-punctuation',
            'url',
            'number-pad',
            'name-phone-pad',
            'decimal-pad',
            'twitter',
            'web-search',
        ];
        let keyboardType = 'default';

        const disabledStyle = disabled ? defaultStyles.inputDisabled : {};

        return (
            <View
                style={[
                    defaultStyles.container,
                    containerStyle,
                    leftIcon && {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    },
                ]}>
                {leftIcon &&
                    (React.isValidElement(leftIcon) ? (
                        <TouchableOpacity
                            style={leftIcon.containerStyle}
                            onPress={this.onInputClear}
                            hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}>
                            {leftIcon}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={leftIcon.containerStyle}
                            onPress={this.onInputClear}
                            hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}>
                            <FontAwesome
                                style={leftIcon.style}
                                name={leftIcon.name}
                                size={leftIcon.size}
                                color={leftIcon.color}
                            />
                        </TouchableOpacity>
                    ))}
                <Input
                    editable={!disabled && editable}
                    clearButtonMode={clear ? 'while-editing' : 'never'}
                    underlineColorAndroid="transparent"
                    ref={el => (this.inputRef = el)}
                    {...restProps}
                    {...valueProps}
                    style={[
                        {
                            height: 44,
                            outlineStyle: 'none',
                        },
                        defaultStyles.input,
                        error ? defaultStyles.inputErrorColor : null,
                        disabledStyle,
                        // 支持自定义样式
                        style,
                    ]}
                    keyboardType={keyboardType}
                    onChange={event => this.onChange(event.nativeEvent.text)}
                    secureTextEntry={type === 'password'}
                    placeholderTextColor="#d3d9e8"
                    onBlur={this.onInputBlur}
                    onFocus={this.onInputFocus}
                />
            </View>
        );
    }
}

const defaultStyles = StyleSheet.create({
    container: {
        height: 38 + 0.5,
        borderWidth: 1,
        borderColor: '#8ea1c4',
        borderRadius: 2.5,
        marginLeft: 15,
        paddingRight: 15,
        marginTop: 0,
        marginBottom: 0,
        flexDirection: 'row',
    },
    text: {
        marginRight: 5,
        textAlignVertical: 'center',
        fontSize: 17,
        color: '#D1D4D9',
    },
    input: {
        flex: 1,
        // height: theme.list_item_height,
        backgroundColor: 'transparent',
        fontSize: 18,
        color: '#000000',
        paddingHorizontal: 15,
    },
    inputDisabled: {
        backgroundColor: '#dddddd',
        color: '#bbbbbb',
    },
    inputErrorColor: {
        color: '#f50',
    },
    clear: {
        backgroundColor: '#cccccc',
        borderRadius: 15,
        padding: 2,
    },
    extra: {
        marginLeft: 5,
        fontSize: 15,
        color: '#888888',
    },
    errorIcon: {
        marginLeft: 5,
        width: 21,
        height: 21,
    },
});

export default InputItem;
