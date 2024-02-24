// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { UserI } from "./user.interface"

@Entity('users_1')
export class User implements UserI {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email_address: string

    @Column()
    password: string

    @Column()
    active: Number

    @Column()
    verified_at: Date

    @Column()
    created_at: Date

    @Column()
    updated_at: Date
}