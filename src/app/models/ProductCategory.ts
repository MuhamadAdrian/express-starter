import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./Product";

@Entity({name: 'product_categories'})
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @OneToMany(() => Product, (product) => product.id)
    products?: Product[]

    @CreateDateColumn({ nullable: true })
    created_at?: Date

    @UpdateDateColumn({ nullable: true })
    updated_at?: Date
}