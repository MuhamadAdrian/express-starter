import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        isEmail: {
            errorMessage: 'Must be a valid e-mail address',
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
        isString: {
            errorMessage: 'Email must be a string',
        },
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long',
        },
        isString: {
            errorMessage: 'Password must be a string',
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },
    },
    name: {
        isString: {
            errorMessage: 'Name must be a string',
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty',
        },
    },
})
