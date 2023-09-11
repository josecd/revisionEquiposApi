/* eslint-disable prettier/prettier */

export class editarObservacionDto {
    equipo?: string
    marca?: string
    modelo?: string
    numeroSerie?: string
    area?: string
    observacion?:string;
    criticidad?:string;
    //Baja
    adquisicionEquipo?:string;
    ubicacion?:string;
    oc?:string;
    sapID?:string;
    diagnosticoTecnico?:string;
    motivoDanio?:string;
    //MTT P&C
    fechaInicio?:string;
    fechaFinaliza?:string;
    fallaDetectadaDuraSer?:string;
    comentariosEntregaEquip?:string;
}


