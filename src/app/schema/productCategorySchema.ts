import { checkSchema } from 'express-validator'

export default checkSchema({
    name: {
        isString: {
            errorMessage: 'Name must be string',
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty',
        },
    },
})
