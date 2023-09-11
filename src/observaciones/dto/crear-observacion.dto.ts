/* eslint-disable prettier/prettier */

export class crearObservacionDto {
    equipo?: string
    marca?: string
    modelo?: string
    numeroSerie?: string
    area?: string
    reporteId:number;
    observacion?:string;
    tipoReporte?:string;
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
    identificador?:number;
}


