import React, { Component } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';
import { Link } from 'react-router-dom';
import { Box, Text, Input } from '../components/common/';

const { stagger, spring } = Animated;

const ImageContainer = ({ source, style, path = '/', text }) => (
    <Box
        width={1 / 3}
        alignItems="center"
        justifyContent="center"
        px={15}
        pb={50}>
        <Animated.View style={style}>
            <Link to={path}>
                <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={source}
                />
            </Link>
            <Text fontSize="xlarge" align="center" mt={20}>
                {text}
            </Text>
        </Animated.View>
    </Box>
);

class HomePage extends Component {
    constructor(props) {
        super(props);

        let anims = [];

        for (let i = 0; i < 3; i++) {
            const opacity = new Animated.Value(0);
            const translateY = opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
            });

            anims.push({ posY: translateY, opacity });
        }

        this.state = {
            animVals: anims,
        };

        this.config = {
            delay: 75,
            duration: 300,
            toValue: 1,
            easing: Easing.ease,
        };

        this.anims = [
            spring(this.state.animVals[0].opacity, this.config),
            spring(this.state.animVals[1].opacity, this.config),
            spring(this.state.animVals[2].opacity, this.config),
        ];

        this.anim = stagger(100, this.anims);
    }

    componentDidMount() {
        this.anim.start();
    }

    render() {
        return (
            <Box
                flex="1 1 auto"
                width={1}
                flexDirection="row"
                fullHeight
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                px={[100, 50]}>
                <ImageContainer
                    style={{
                        transform: [
                            {
                                translateY: this.state.animVals[0].posY,
                            },
                        ],
                        opacity: this.state.animVals[0].opacity,
                    }}
                    path="/search"
                    source={require('../../assets/icons/custom-master.jpeg')}
                    text={`Customer\nMaster`}
                />

                <ImageContainer
                    style={{
                        transform: [
                            {
                                translateY: this.state.animVals[1].posY,
                            },
                        ],
                        opacity: this.state.animVals[1].opacity,
                    }}
                    source={require('../../assets/icons/material-master.jpeg')}
                    text={`Material\nMaster`}
                />
                <ImageContainer
                    style={{
                        transform: [
                            {
                                translateY: this.state.animVals[2].posY,
                            },
                        ],
                        opacity: this.state.animVals[2].opacity,
                    }}
                    source={require('../../assets/icons/vendor-master.jpeg')}
                    text={`Vendor\nMaster`}
                />
            </Box>
        );
    }
}

export default HomePage;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: 150,
        height: 150,
    },
});
