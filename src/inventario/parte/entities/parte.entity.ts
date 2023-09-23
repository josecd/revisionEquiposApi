import { Inventarios } from "src/inventario/inventario/entities/inventario.entity";
import {
    Entity, Column, PrimaryGeneratedColumn,
    OneToOne, JoinColumn, OneToMany, ManyToOne, JoinTable,
    MaxKey
} from "typeorm";
import { ParteImagen } from "./parte-imagen.entity";

@Entity({ name: 'parte' })

export class Parte {
    @PrimaryGeneratedColumn()
    idParte: number

    @Column({ nullable: true })
    descripcion: string
    @Column( {nullable: true })
    noParte: string
    @Column('bigint', {nullable: true,width: 50 })
    cantidad: number


    @Column({ default: '1' })
    esActivo: string
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fechaRegistro: Date

    @Column({ nullable: true }) /*nullable sirve para poder decir que puede ser null */
    inventarioId: number
    @Column({ nullable: true })
    userId: number


    @ManyToOne(() => Inventarios, report => report.partes)
    @JoinTable()
    inventario: Inventarios

    @OneToMany(() => ParteImagen, parteImg => parteImg.parte)
    partesImagen: ParteImagen[]

}
