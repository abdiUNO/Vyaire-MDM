import React from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
    Keyboard,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { AntDesign } from '@expo/vector-icons';
import { Box, Text } from '../common';
import MinimiseAnimation from './minimiseAnimation';

const TableHeading = ({ children, title, onPressTable }) => (
    <>
        <View style={styles.TableHeaderContainer}>
            <View>
                <Text
                    style={[
                        styles.menuItemText,
                        styles.bold,
                        styles.menuItemsHeader,
                    ]}>
                    {title}
                </Text>
            </View>
            <View>
                <TouchableOpacity onPress={onPressTable}>
                    <AntDesign name="minus" size={38} color="white" />
                </TouchableOpacity>
            </View>
        </View>

        {children}
    </>
);

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };

        Keyboard.removeAllListeners();
    }

    render() {
        const { width, height, marginBottom, overflowY } = this.props;

        if (this.state.loading === true)
            return (
                <Box
                    display="flex"
                    flex={1}
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="650px">
                    <ActivityIndicator />
                </Box>
            );

        return (
            <ScrollView
                pointerEvents={'box-none'}
                keyboardShouldPersistTaps="always"
                style={{
                    backgroundColor: 'white',
                    paddingTop: 50,
                    paddingBottom: 75,
                    height: height,
                    overflowY: height == '0px' ? 'hidden' : 'auto',
                }}>
                <View
                    pointerEvents={'box-none'}
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 10,
                        width: '105%',
                    }}>
                    <Box style={{ width: '100%' }}>
                        <TableHeading
                            onPressTable={this.props.onPressTable}
                            title={this.props.title}
                        />
                        <View style={{ zIndex: 1 }}>
                            <MinimiseAnimation
                                content={this.props.tableContent}
                                onMenuDismiss={this.props.onMenuDismiss}
                                style={{ position: 'absolute', zIndex: 1 }}
                                isToggled={this.props.isToggled}
                            />
                        </View>
                    </Box>
                </View>
            </ScrollView>
        );
    }
}

class Default extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;

        return (
            <DimensionAware
                render={dimensions => (
                    <Page
                        {...{
                            ...props,
                            width: getWindowWidth(dimensions),
                            height: this.props.tblHeight
                                ? this.props.tblHeight
                                : getWindowHeight(dimensions),
                        }}
                    />
                )}
            />
        );
    }
}
const styles = StyleSheet.create({
    TableHeaderContainer: {
        paddingLeft: 32,
        backgroundColor: '#234385',
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuItemsHeader: {
        color: 'white',
        fontFamily: 'Poppins',
        fontSize: 17,
    },
    menuItemText: {
        fontSize: 16,
        color: '#10254D',
        fontFamily: 'Poppins',
        fontWeight: '400',
    },
    bold: { color: '#10254D', fontFamily: 'Poppins', fontWeight: '700' },
});

export default Default;
