import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToOne ,JoinColumn ,OneToMany} from "typeorm";
import { Reportes } from "./reportes.entity";
import { Observacion } from "src/observaciones/entitys/observacion.entity";

@Entity({name:'firmas_obs'})
export class FirmasObs {
    @PrimaryGeneratedColumn()
    idFirmaObs: number
    @Column()
    url: string
    @Column()
    nombreArchivo: string
    @Column()
    tipo: string
    @Column()
    path: string
    @Column()
    nombreFirma: string
    @Column({default: '1'})
    esActivo: string
    @Column({default: '1'})
    estado: string
    @Column({type:'datetime',default:()=>'CURRENT_TIMESTAMP'}) 
    fechaRegistro: Date

    @Column({nullable:true}) /*nullable sirve para poder decir que puede ser null */
    obsId: number

    @ManyToOne(()=>Observacion,obs=>obs.firmasObs)
    obsF:Observacion
}
