import { checkSchema } from 'express-validator'
import { productCategoryRepository } from '../services/productCategoryService'

const validation = (method: string = 'POST') =>
    checkSchema({
        name: {
            notEmpty: {
                errorMessage: 'Name cannot be empty',
                if: () => method !== 'PUT',
            },
            isString: {
                errorMessage: 'Name must be a string',
            },
        },
        description: {
            notEmpty: {
                errorMessage: 'Description cannot be empty',
                if: () => method !== 'PUT',
            },
            isString: {
                errorMessage: 'Description must be a string',
            },
            isLength: {
                options: {
                    min: 20,
                    max: 225,
                },
                errorMessage: 'Minimal character is 20 and maximum is 225',
            },
        },
        price: {
            notEmpty: {
                errorMessage: 'Price cannot be empty',
                if: () => method !== 'PUT',
            },
            isNumeric: {
                errorMessage: 'Price must be a number',
            },
        },
        category_id: {
            // notEmpty: {
            //     errorMessage: 'Category cannot be empty',
            //     if: () => method !== 'PUT',
            // },
            custom: {
                options: async (value) => {
                    const category = await productCategoryRepository.findOneBy({
                        id: value,
                    })

                    if (!category)
                        throw Error(
                            'Category must be one of the product categories'
                        )
                },
            },
        },
    })

export default validation
