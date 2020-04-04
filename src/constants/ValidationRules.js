import { globalMDMFieldRules } from './FieldRules';

export const singleFieldValidation = ({ key, value }, schema, setFormError) => {
    if (schema === 'globalMDMFieldRules') {
        globalMDMFieldRules
            .validate({ [key]: value })
            .then((valid) => {
                setFormError(valid, key, null);
            })
            .catch((error) => {
                setFormError(false, key, error.errors);
            });
    }
};

// export const singleFieldValidation = ({key, value }) => {
//   const validationResponse = {isValid: true};
//   if (rules[key]) {
//     const validation = new Validator({[key]: value}, {[key]: rules[key]});
//     validationResponse.isValid = validation.passes();
//     if (!validationResponse.isValid) {
//       validationResponse.errors = validation.errors.all();
//     }
//   }
//   return validationResponse;
// };

export const allFieldsValidation = (data) => {
    const validation = new Validator(data, rules);
    const validationResponse = { isValid: validation.passes() };
    if (!validationResponse.isValid) {
        validationResponse.errors = validation.errors.all();
    }
    return validationResponse;
};
