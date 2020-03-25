/**
 * @prettier
 */

import React, { Component, Fragment, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Box } from './common/Box.jsx';
import Text from './common/Text.jsx';
import { FormSelect, FormInput } from './form';
import { Link } from '../navigation/router';
import { ajaxPostRequest } from '../appRedux/sagas/config';

const FileTypes = ['', 'License', 'CreditApp', 'PurchaseOrder', 'Supporting'];

function UploadFile({ fileData, error, onChange }) {
    return (
        <Box display="flex" flexDirection="row" alignItems="center" mt={3}>
            <Box display="flex" flex="1" flexDirection="row" mb="-20px">
                <MaterialIcons name="description" size={25} color="#1D4289" />
                <Text
                    color="primary"
                    fontWeight={500}
                    fontFamily="Poppins"
                    fontSize="17px"
                    ml="10px">
                    {fileData.DocumentName}
                </Text>
            </Box>
            <Box display="flex" flex="1" flexDirection="row" alignItems="top">
                <FormSelect
                    error={error}
                    name="type"
                    required
                    onChange={onChange}
                    variant="solid">
                    <option value="0">Choose from...</option>
                    <option value="1">License</option>
                    <option value="2">CreditApp</option>
                    <option value="3">PurchaseOrder</option>
                    <option value="4">Supporting</option>
                </FormSelect>
            </Box>
        </Box>
    );
}

function DownloadFile({ fileData, onClick }) {
    const [downloading, setState] = useState(false);

    return (
        <Box
            display="flex"
            flexDirection="row"
            maxWidth="350px"
            alignItems="center"
            justifyContent="space-between">
            <Box display="flex" flexDirection="row" alignItems="center" mr="2%">
                {downloading && <ActivityIndicator />}
                <MaterialIcons
                    name="description"
                    size={25}
                    color="#1D4289"
                    style={{ paddingBottom: 5 }}
                />
                <Link
                    to="#"
                    style={{
                        fontFamily: 'Poppins',
                        fontSize: '17px',
                        ml: '10px',
                    }}
                    onClick={e => {
                        e.preventDefault();
                        setState(true);
                        ajaxPostRequest(
                            'https://rc3hpb3fv4.execute-api.us-east-2.amazonaws.com/dev',
                            {
                                UserId: localStorage.getItem('userId'),
                                S3ObjectKey: fileData.S3objectKey,
                            }
                        ).then(({ ResultData: resp }) => {
                            setState(false);
                            window.open(resp.PreSignedURL, '_blank');
                        });
                    }}>
                    {fileData.DocumentName}
                </Link>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center ">
                <Text
                    color="#58595B"
                    fontFamily="Poppins"
                    fontSize="17px"
                    ml="10px">
                    {`: ${FileTypes[fileData.DocumentTypeId]}`}
                </Text>
            </Box>
        </Box>
    );
}

function FilesList({
    files = [],
    readOnly = false,
    formErrors,
    onChange,
    onClick,
}) {
    if (files.length <= 0) return <Box />;

    return (
        <Fragment>
            <Text
                m="16px 0 16px 5%"
                fontWeight="light"
                color="#4195C7"
                fontSize="28px">
                ATTACHMENTS
            </Text>
            <Box flexDirection="row" justifyContent="center">
                <Box width={1 / 2} mx="auto" alignItems="center">
                    <Box display="flex">
                        {files.map(file => (
                            <Box key={file.DocumentName}>
                                {readOnly ? (
                                    <DownloadFile
                                        fileData={file}
                                        onClick={onClick}
                                    />
                                ) : (
                                    <UploadFile
                                        error={
                                            formErrors
                                                ? formErrors[file.DocumentName]
                                                : null
                                        }
                                        fileData={file}
                                        onChange={(value, e) =>
                                            onChange(value, file.DocumentName)
                                        }
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box width={1 / 2} mx="auto" alignItems="center" />
            </Box>
        </Fragment>
    );
}

export default FilesList;
