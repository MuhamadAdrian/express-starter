import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { User } from './User'

@Entity({ name: 'sessions' })
export class Session {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'text' })
    token!: string

    @Column({ type: 'text' })
    refresh_token!: string

    @Column({ nullable: true })
    ip?: string

    @Column({ nullable: true })
    device_name?: string

    @Column({ nullable: true })
    user_agent?: string

    @Column({ nullable: true })
    os?: string

    @ManyToOne(() => User, (user) => user.id, {
        cascade: ['remove'],
    })
    @JoinColumn({ name: 'user_id' })
    user?: User

    @Column({ default: false })
    is_active?: boolean

    @CreateDateColumn()
    created_at?: Date

    @UpdateDateColumn()
    updated_at?: Date
}
