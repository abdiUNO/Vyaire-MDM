import styled from 'styled-components';
import { BORDER, COMMON, FLEX, LAYOUT } from '../constants';

export const Wrapper = styled.div`
    position: relative;

    max-width: 350px;
    vertical-align: middle;
    box-sizing: content-box;
    opacity: 1;

    ${FLEX}
    ${LAYOUT}
    ${COMMON};
    ${BORDER};
`;

export default Wrapper;
