import React from 'react';
import { PageTitle } from './index';
import BreadCrumbs from '../BreadCrumbs';
import { View } from 'react-native';
import FlashMessage from '../FlashMessage';

const withTitle = ({
    component: Component,
    blacklist,
    breadcrumbs,
    backgroundColor,
    title,
}) => {
    return class Title extends React.Component {
        render() {
            const {
                location: { state = {} },
                history: { action },
            } = this.props;

            const flash = action === 'PUSH' && state.flash ? state.flash : null;

            let links = breadcrumbs || this.props.location.pathname.split('/');
            const _blacklist = blacklist || [];
            return (
                <React.Fragment>
                    <PageTitle title={title} />
                    {this.props.location.pathname !== '/' && (
                        <View
                            style={{
                                backgroundColor: backgroundColor || '#FFF',
                            }}>
                            <BreadCrumbs
                                title={title}
                                currentPath={this.props.location.pathname}
                                links={links}
                                blacklist={_blacklist}
                            />
                        </View>
                    )}
                    {flash && (
                        <FlashMessage
                            bg={backgroundColor || '#FFF'}
                            message={flash}
                        />
                    )}
                    <Component {...this.props} />
                </React.Fragment>
            );
        }
    };
};

export default withTitle;
