import React from 'react';
import { Text } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Button from './Button';
import CenterView from './CenterView';
import TextInput from './TextInput';
import { linkTo } from '@storybook/addon-links';

storiesOf('Input', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('default', () => <TextInput />)
    .add('outline', () => <TextInput />);

storiesOf('Button', module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .add('with text', () => (
        <Button onPress={action('clicked-text')}>
            <Text>Hello Button</Text>
        </Button>
    ))
    .add('with some emoji', () => (
        <Button onPress={action('clicked-emoji')}>
            <Text>😀 😎 👍 💯</Text>
        </Button>
    ));
