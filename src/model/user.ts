import { Entity, PrimaryGeneratedColumn, Column,OneToMany,CreateDateColumn } from "typeorm"
import { Blog } from "./blog"

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!:number

    @Column({unique:true})
    username!:string

    @Column({unique:true})
    email!:string

    @Column({unique:true})
    password!:string

    @OneToMany(() => Blog, (blog) => blog.author)
    blogs!: Blog[];

    @CreateDateColumn()
    createAt!:Date

}