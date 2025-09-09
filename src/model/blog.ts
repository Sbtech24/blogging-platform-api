import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,CreateDateColumn } from "typeorm"
import { User } from "./user"

@Entity()
export class Blog{

    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    title!:string

    @Column("text")
    content!:string

    @Column()
    category!:string

    @Column("text", {array:true})
    tags!:string[]

    @ManyToOne(() => User, (user) => user.blogs, { onDelete: "CASCADE" })
    author!: User;

    @CreateDateColumn()
    createdAt!: Date;

}