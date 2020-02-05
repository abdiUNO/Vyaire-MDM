const _ = require('lodash');

export const resolveDependencies = (dependencies, schema, obj, type) => {
    const typeFuncs = {
        oneOf: deps =>
            _.find(deps, val =>
                _.isMatch(
                    obj,
                    _.mapValues(val, o => o.toString())
                )
            ),
        allOf: deps =>
            _.isMatch(
                obj,
                _.reduce(deps, (sum, dependency, index) => ({
                    ...sum,
                    ...dependency,
                }))
            ),
        anyOf: () => {},
    };

    return {
        ...schema,
        display: typeFuncs[type](dependencies, obj) ? 'block' : 'none',
    };
};

export const passFields = (_system, fields) => {
    const parentObj = {
        salesOrg: {
            display: 'none',
        },
        ..._system,
    };
    return _.mapValues(parentObj, (schema, fieldKey, obj) => {
        const { dependencies, ...rest } = schema;

        if (!dependencies) {
            return _.isObject(schema)
                ? { ...rest, name: fieldKey, display: 'block' }
                : schema;
        } else {
            const rests = _.map(dependencies, (val, key) => {
                return resolveDependencies(val, rest, fields, key);
            });

            return _.reduce(rests, (sum, n) => ({ sum, n }));
        }
    });
};
