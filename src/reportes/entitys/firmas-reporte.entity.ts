import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToOne ,JoinColumn ,OneToMany} from "typeorm";
import { Reportes } from "./reportes.entity";

@Entity({name:'firmas_reporte'})
export class FirmasReporte {
    @PrimaryGeneratedColumn()
    idFirmaReporte: number
    @Column()
    url: string
    @Column()
    nombreArchivo: string
    @Column()
    tipo: string
    @Column({default: '1'})
    esActivo: string
    @Column({default: '1'})
    estado: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date

    @Column({nullable:true}) /*nullable sirve para poder decir que puede ser null */
    reporteId: number

    @ManyToOne(()=>Reportes,obs=>obs.firmasReporte)
    reporteF:Reportes
}
