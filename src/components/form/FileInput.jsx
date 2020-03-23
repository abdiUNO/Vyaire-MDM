import React, { Component } from 'react';
import { Flex, Text, Box } from '../common';
import { MaterialIcons } from '@expo/vector-icons';

function FileInput({ filename, index }) {
    return (
        <Box>
            <Text>{this.props.filename}</Text>
            <label htmlFor="file-upload" className="custom-file-upload">
                <MaterialIcons name="attach-file" size={20} color="#fff" />
                Distribution Agreement
            </label>
            <input
                id={`file-${index}`}
                type="file"
                onChange={this.selectFile}
            />
        </Box>
    );
}

export default FileInput;
