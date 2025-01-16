import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
        isString: {
            errorMessage: 'Email must be a string',
        },
        isEmail: {
            errorMessage: 'Must be a valid e-mail address',
        },
    },
    password: {
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },
        isString: {
            errorMessage: 'Password must be a string',
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long',
        },
    },
})
