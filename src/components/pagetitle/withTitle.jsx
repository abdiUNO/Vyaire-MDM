import React from 'react';
import { PageTitle } from './index';
import BreadCrumbs from '../BreadCrumbs';
import { View } from 'react-native';
const withTitle = ({ component: Component, backgroundColor, title }) => {
    return class Title extends React.Component {
        render() {
            console.log(this.props);
            const links = this.props.location.pathname.split('/');
            return (
                <React.Fragment>
                    <PageTitle title={title} />
                    {this.props.location.pathname !== '/' && (
                        <View
                            style={{
                                backgroundColor: backgroundColor || '#FFF',
                            }}>
                            <BreadCrumbs title={title} links={links} />
                        </View>
                    )}
                    <Component {...this.props} />
                </React.Fragment>
            );
        }
    };
};

export default withTitle;
