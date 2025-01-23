import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { ProductCategory } from './ProductCategory'

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ type: 'text' })
    description?: string

    @ManyToOne(() => ProductCategory, (productCategory) => productCategory.id, {
        cascade: ['update'],
    })
    @JoinColumn({ name: 'product_category_id' })
    productCategory?: ProductCategory

    @Column()
    price!: number

    @CreateDateColumn({ nullable: true })
    created_at?: Date

    @UpdateDateColumn({ nullable: true })
    updated_at?: Date
}
