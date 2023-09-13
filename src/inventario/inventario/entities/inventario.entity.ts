import { Hoteles } from "src/hoteles/entitys/hotel.entity";
import { Parte } from "src/inventario/parte/entities/parte.entity";
import { Observacion } from "src/observaciones/entitys/observacion.entity";
import { FirmasReporte } from "src/reportes/entitys/firmas-reporte.entity";
import { User } from "src/users/entitiys/user.entity";
import {
    Entity, Column, PrimaryGeneratedColumn,
    OneToOne, JoinColumn, OneToMany, ManyToOne, JoinTable, ManyToMany
} from "typeorm";


@Entity({ name: 'inventario' })
export class Inventarios {
    @PrimaryGeneratedColumn()
    idInventario: number

    @Column({nullable:true})
    marca: string
    @Column({nullable:true})
    equipo: string

    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date
    @Column({default: '1'})
    esActivo: string

    @Column({nullable:true})
    userId: number
    @Column({nullable:true})
    hotelId: number

    @ManyToOne(()=>User,user=>user.reportes)
    usuario:User

    @OneToMany(()=>Parte,(parte)=>parte.inventario)
    // @JoinTable({ 
    //     name: 'observacion_imagen',
    //     joinColumn: { name: 'idObservacion' },
    //     inverseJoinColumn: { name: 'idObservacionImagen' }
    // })
    partes:Inventarios[]

    @ManyToOne(()=>Hoteles,user=>user.inventarios)
    hoteles:Hoteles

}
