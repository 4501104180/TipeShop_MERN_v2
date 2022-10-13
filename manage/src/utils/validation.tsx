import * as yup from 'yup';

// ----------------------Account----------------------
export const createAccountValidation = yup.object().shape({
  phone_number: yup
    .string()
    .required('Phone number is required!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Invalid phone number!'),
  name: yup.string().required('Name is required!'),
  password: yup.string().required('Password is required!'),
  passwordConfirm: yup.string().required('Confirm is required!'),
});

export const updateAccountValidation = yup.object().shape({
  phone_number: yup
    .string()
    .required('Phone number is required!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Invalid phone number!'),
  name: yup.string().required('Name is required!'),
});
// ----------------------Category----------------------
export const createCategoryValidation = yup.object().shape({
  name: yup.string().required('Name is required!'),
});
// ----------------------Products----------------------
export const createProductValidation = yup.object().shape({
  name: yup.string().required('Name is required!'),
  quantity: yup
    .string()
    .required('Quantity is required!')
    .matches(/^[0-9]+$/, 'Invalid number!'),
  limit: yup
    .string()
    .nullable()
    .matches(/^[0-9]+$/, 'Invalid number!'),
  discount: yup.string().matches(/^[0-9]+$/, 'Invalid number!'),
  discount_rate: yup.string().matches(/^[0-9]{0,2}$/, 'Invalid number! (number 1-99)'),
  original_price: yup
    .string()
    .required('Orginal Price is required!')
    .matches(/^[0-9]+$/, 'Invalid number!'),
  price: yup
    .string()
    .required('Price is required!')
    .matches(/^[0-9]+$/, 'Invalid number!'),
  images: yup.array().min(1, 'This field is required!'),
});
export const updateProductValidation = yup.object().shape({
  name: yup.string().required('Name is required!'),
  quantity: yup
    .string()
    .required('Quantity is required!')
    .matches(/^[0-9]+$/, 'Invalid number!'),
  limit: yup
    .string()
    .nullable()
    .matches(/^[0-9]+$/, 'Invalid number!'),
  discount: yup.string().matches(/^[0-9]+$/, 'Invalid number!'),
  discount_rate: yup.string().matches(/^[0-9]{0,2}$/, 'Invalid number! (number 1-99)'),
  original_price: yup
    .string()
    .required('Orginal Price is required!')
    .matches(/^[0-9]+$/, 'Invalid number!'),
  price: yup
    .string()
    .required('Price is required!')
    .matches(/^[0-9]+$/, 'Invalid number!'),
  images: yup.array().min(1, 'This field is required!'),
});
