import { Animated, Easing } from 'react-native';
import { useState, useEffect } from 'react';

const useAnimation = ({
    doAnimation,
    duration,
    delay = 0,
    ease = Easing.ease,
    type = 'timing',
    onEnd,
}) => {
    const [animation, setAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated[type](animation, {
            toValue: doAnimation ? 1 : 0,
            delay,
            duration,
            ease,
        }).start(onEnd);
    }, [doAnimation]);

    return animation;
};

export default useAnimation;
