import {
    space,
    color,
    flexbox,
    grid,
    position,
    variant,
    layout,
    border,
    compose,
    background,
    shadow,
    fontWeight,
    typography,
    display,
    system,
} from 'styled-system';
import theme from '../theme';

const getValue = (obj, key, def, p, undef) => {
    key = key && key.split ? key.split('.') : [key];

    for (p = 0; p < key.length; p++) {
        obj = obj ? obj[key[p]] : undef;
    }

    return obj === undef ? def : obj;
};

export const get = key => getValue(theme, key, {});

const whiteSpace = system({
    whiteSpace: {
        property: 'whiteSpace',
        cssProperty: 'whiteSpace',
    },
});

export const LAYOUT = layout;
export const TYPOGRAPHY = compose(typography, fontWeight, whiteSpace);
export const COMMON = compose(space, color, display, background);
export const BORDER = compose(border, shadow);
export const FLEX = flexbox;
export { flexbox, position, variant, grid, system };
