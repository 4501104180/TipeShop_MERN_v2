import * as yup from 'yup';

// ----------------------Account----------------------
export const createAccountValidation = yup.object().shape({
	name: yup.string().required('Name is required!').max(255, 'Maximum 255 character'),
	password: yup
		.string()
		.required('Password is required!')
		.min(6, 'Password is too short - should be 6 chars minimum.')
		.max(15, 'The password is too long - the maximum should be 15 characters.'),
	passwordConfirm: yup
		.string()
		.required('Confirm is required!')
		.min(6, 'Password is too short - should be 6 chars minimum.')
		.max(15, 'The password is too long - the maximum should be 15 characters.')
		.oneOf([yup.ref('password'), null], 'Passwords must match'),
});

// ----------------------Address----------------------
export const createAddressValidation = yup.object().shape({
	name: yup.string().required('Name is required!').max(255, 'Maximum 255 character'),
	phoneNumber: yup
		.string()
		.required('Phone number is required!')
		.matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Invalid phone number!'),
	location: yup.object({
		region: yup.string().required('Region is required!'),
		district: yup.string().required('District is required!'),
		ward: yup.string().required('Ward is required!'),
	}),
	street: yup.string().required('Street is required!'),
});
