import { checkSchema } from 'express-validator'
import { productCategoryRepository } from '../services/productCategoryService'

export default checkSchema({
    name: {
        notEmpty: {
            errorMessage: 'Name cannot be empty',
        },
        isString: {
            errorMessage: 'Name must be a string',
        },
    },
    description: {
        notEmpty: {
            errorMessage: 'Description cannot be empty',
        },
        isString: {
            errorMessage: 'Description must be a string',
        },
        isLength: {
            options: {
                min: 20,
                max: 225
            },
            errorMessage: 'Description must be a string',
        },
    },
    price: {
        notEmpty: {
            errorMessage: 'Price cannot be empty',
        },
        isNumeric: {
            errorMessage: 'Price must be a number',
        },
    },
    category_id: {
        notEmpty: {
            errorMessage: 'Category cannot be empty',
        },
        custom: {
            options: async (value) => {
                const category = await productCategoryRepository.findOneBy({
                    id: value
                })

                if (!category)
                    throw Error('Category must be one of the product categories')
            }
        },
    }
})
