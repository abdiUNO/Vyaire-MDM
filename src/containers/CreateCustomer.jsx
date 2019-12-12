import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Card } from '../components/common';
import Input from '../components/Input';

const FormInput = ({ text, placeholder }) => (
    <View
        style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 50,
            paddingRight: 0,
            marginVertical: 15,
        }}>
        <View style={{ flex: 1 / 3 }}>
            <Text
                style={{
                    fontWeight: '500',
                    fontSize: 18,
                    color: '#22438A',
                }}>
                {text}
            </Text>
        </View>
        <Input
            containerstyle={{
                marginHorizontal: 0,
                flex: 1 / 2,
            }}
            clear
            labelNumber={4}
            placeholder={placeholder}
        />
    </View>
);

const Page = ({ width }) => {
    return (
        <View
            style={{
                paddingTop: 100,
            }}>
            <Text
                style={{
                    fontWeight: 'bold',
                    fontSize: 32,
                    color: '#385696',
                    paddingHorizontal: width < 1440 ? 100 : width * 0.1,
                    marginBottom: 35,
                }}>
                Customer Master Setup
            </Text>
            <ScrollView
                style={{
                    flex: 1,
                    paddingHorizontal: width < 1440 ? 100 : width * 0.1,
                    paddingVertical: 5,
                }}>
                <Card>
                    <View
                        style={{
                            flex: 1,
                            marginTop: 25,
                        }}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Customer Number :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter number"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Customer Name :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={4}
                                placeholder="Enter name"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Type of Customer :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter type"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Industry Code :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter code"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Street :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter street"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    City :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter city"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Postal Code :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter postal code"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Region :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter region"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Country :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter country"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Telephone :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter telephone"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Fax :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter fax"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    Email :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter email"
                            />
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: 50,
                                paddingRight: width < 1440 ? 0 : 50,
                                marginVertical: 15,
                            }}>
                            <View style={{ flex: 1 / 3 }}>
                                <Text
                                    style={{
                                        fontWeight: '500',
                                        fontSize: 18,
                                        color: '#22438A',
                                    }}>
                                    State :
                                </Text>
                            </View>
                            <Input
                                containerstyle={{
                                    marginHorizontal: width < 1440 ? 0 : 50,
                                    flex: width < 1440 ? 1 / 2 : 1,
                                }}
                                clear
                                labelNumber={3}
                                placeholder="Enter state"
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 50,
                            paddingRight: width < 1440 ? 0 : 50,
                            marginVertical: 15,
                        }}>
                        <View style={{ flex: 1 / 3 }}>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    fontSize: 18,
                                    color: '#22438A',
                                }}>
                                Tax Number :
                            </Text>
                        </View>
                        <Input
                            containerstyle={{
                                marginHorizontal: width < 1440 ? 0 : 50,
                                flex: width < 1440 ? 1 / 2 : 1,
                            }}
                            clear
                            labelNumber={3}
                            placeholder="Enter tax number"
                        />
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 50,
                            paddingRight: width < 1440 ? 0 : 50,
                            marginVertical: 15,
                        }}>
                        <View style={{ flex: 1 / 3 }}>
                            <Text
                                style={{
                                    fontWeight: '500',
                                    fontSize: 18,
                                    color: '#22438A',
                                }}>
                                VAT Reg No :
                            </Text>
                        </View>
                        <Input
                            containerstyle={{
                                marginHorizontal: width < 1440 ? 0 : 50,
                                flex: width < 1440 ? 1 / 2 : 1,
                            }}
                            clear
                            labelNumber={3}
                            placeholder="Enter vat reg no"
                        />
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
};

const Default = props => (
    <DimensionAware
        render={dimensions => (
            <Page
                {...{
                    ...props,
                    width: getWindowWidth(dimensions),
                    height: getWindowHeight(dimensions),
                    marginBottom: 25,
                }}
            />
        )}
    />
);

export default Default;
