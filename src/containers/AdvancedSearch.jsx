import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
    DimensionAware,
    getWindowHeight,
    getWindowWidth,
} from 'react-native-dimension-aware';
import { Column, Flex, Card,Button } from '../components/common';
import { Colors } from '../theme';
import FormInput from '../components/form/FormInput';
import { advanceSearchCustomer } from '../appRedux/actions/Customer';
import { connect } from 'react-redux';
import Loading from '../components/Loading';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {    
            formData: {"userId": "credit.user"}, 
            loading: this.props.fetching,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.customerdata != this.props.customerdata ) {

            this.props.history.push({
                pathname: `/search/results`,
                state: newProps.customerdata,
            });      
        }
        if (newProps.fetching != this.props.fetching) {
            this.setState({
                loading: newProps.fetching,
            });            
        }
    }

    onFieldChange = ( value,e) => {   
        const {name}=e.target          
        this.setState(
            {
                formData: {
                    ...this.state.formData,
                    [name]: value.trim(),
                },
            });         
    }

    onSubmit = () => {
       
        let {formData}=this.state;
        try{
            const searchModel = {
                "customerSearchType": 2,
                "searchhits": {
                "from": 0,
                "size": 10
                }
            }
            var postData= {
                ...searchModel,
                ...formData
            }
                  
            console.log('postdata',postData)
            this.props.advanceSearchCustomer(postData);
            
            // this.resetForm();
        }catch(error){
            console.log('form validtion error')
        }
    }   


    render() {
        const { width, height, marginBottom, location } = this.props;
        const { state } = location;
        const customer = state;
        if(this.state.loading){
            return <Loading/>
        }       
       
        return (
            <View
                style={{
                    backgroundColor: '#EFF3F6',
                    paddingTop: 50,
                    paddingBottom: 75,
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: width < 1440 ? 75 : width * 0.1,
                        paddingBottom: 5,
                    }}>
                    <Card>
                        <Text
                            style={{
                                fontWeight: '500',
                                fontSize: 32,
                                color: Colors.lightBlue,
                                marginBottom: 20,
                                paddingLeft: 45,
                            }}>
                            Advance Search
                        </Text>
                        <Flex>
                            <Column
                                padding="15px 45px 15px 55px"
                                style={{
                                    flex: 1,
                                    alignItems: 'flex-start',
                                }}>
                                
                                <FormInput onChange={this.onFieldChange} name="mdmNumber" label="MDM Number" my={1} />
                                <FormInput onChange={this.onFieldChange} name="name" label="Name" my={1} />
                                <FormInput onChange={this.onFieldChange} name="street" label="Street" my={1} />
                                <FormInput onChange={this.onFieldChange} name="city" label="City" my={1} />
                                <FormInput onChange={this.onFieldChange} name="state" label="State" my={1} />
                                <FormInput onChange={this.onFieldChange} name="zip" label="Zip Code" my={1} />
                                <FormInput onChange={this.onFieldChange} name="dunsNumber" label="DUNS Number" my={1} />
                                <FormInput onChange={this.onFieldChange} name="taxIDOrVATRegNumber" label="Tax ID/ VAT Reg No:" my={1} />
                            </Column>
                        </Flex>
                    </Card>
                    <Flex
                        justifyEnd
                        alignCenter
                        style={{
                            paddingTop: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 15,
                            marginTop: 20,
                            marginBottom: 10,
                            marginHorizontal: 25,
                        }}>

                        <Button
                            onPress={(event) =>this.onSubmit() }
                            title="Submit"
                        />
                        <Button
                            title="Cancel"
                            onPress={(event) =>this.onSubmit() }
                        />
                    </Flex>
                </View>
            </View>
        );
    }
}

class Default extends React.Component {
    render() {
        const props = this.props;

        return (
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
    }
}

const mapStateToProps = ({ customer }) => {
    const { customerdata, fetching } = customer;
    return { customerdata, fetching };
};

export default connect(mapStateToProps, { advanceSearchCustomer })(Default);
