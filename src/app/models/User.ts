import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm'
import { Session } from './Session'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    email!: string

    @Column()
    password!: string

    @Column()
    name!: string

    @OneToMany(() => Session, (session) => session.user)
    sessions?: Session[]

    @CreateDateColumn({ nullable: true })
    created_at?: Date

    @UpdateDateColumn({ nullable: true })
    updated_at?: Date
}
