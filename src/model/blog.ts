import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

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

}