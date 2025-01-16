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

    @Column()
    ip?: string

    @Column()
    device_name?: string

    @Column()
    user_agent?: string

    @Column()
    os?: string

    @ManyToOne(() => User, (user) => user.id, {
        cascade: ['remove'],
    })
    @JoinColumn({ name: 'user_id' })
    user?: User

    @Column({ default: false })
    is_active?: string

    @CreateDateColumn()
    created_at?: Date

    @UpdateDateColumn()
    updated_at?: Date
}
