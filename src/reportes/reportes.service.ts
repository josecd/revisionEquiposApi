/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, JoinColumn, DataSource } from 'typeorm';
import { Reportes } from './entitys/reportes.entity';
import { UsersService } from 'src/users/users.service';
import { HotelesService } from 'src/hoteles/hoteles.service';
import { crearReporteDto } from './dto/crear-reporte.dto';
import { editarReporteDto } from './dto/editar-reporte.dto';
import { crearFirmaDto } from './dto/crear-firmas.dto';
import { FirmasReporte } from './entitys/firmas-reporte.entity';
import { Observacion } from 'src/observaciones/entitys/observacion.entity';
import { ObservacionImagen } from 'src/observaciones/entitys/observacion-imagen.entity';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';
import * as moment from "moment";
import { ObservacionesService } from 'src/observaciones/observaciones.service';
import { Hoteles } from 'src/hoteles/entitys/hotel.entity';
import { User } from 'src/users/entitiys/user.entity';
import { ObservacionComentario } from 'src/observaciones/entitys/observacion-comentario.entity';


const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hbs = require('handlebars')
const hb = require('handlebars')

const readFile = utils.promisify(fs.readFile)

const PDFDocument = require('pdfkit-table');


@Injectable()
export class ReportesService {

  constructor(
    @InjectRepository(Reportes)
    private reporteRepositorio: Repository<Reportes>,
    @InjectRepository(FirmasReporte)
    private firmasRepositorio: Repository<FirmasReporte>,

    private _user: UsersService,
    private _hotel: HotelesService,
    private _aws: UploadFileS3Service,

    // @InjectRepository(Observacion)
    // private observacionRepositorio: Repository<Observacion>,
    // @InjectRepository(ObservacionImagen)
    // private observacionImgRepositorio: Repository<ObservacionImagen>,

    private readonly _up: UploadFileS3Service,
    @Inject(forwardRef(() => ObservacionesService)) private readonly _observaciones: ObservacionesService
  ) { }

  listarReportes() {
    return this.reporteRepositorio.find({
      relations: ['hoteles', 'usuario'],
      order: { fechaRegistro: 'DESC' }
    });
  }
  // ASC
  // DESC
  async listarReportePorIdTodaLaInfo(id: number) {
    const reporteFound = await this.reporteRepositorio.findOne({
      where: {
        idReporte: id,
      },
      relations: ['hoteles', 'usuario']
    })
    const queyView = await this.reporteRepositorio
      .createQueryBuilder('reportes')
      .where(`reportes.idReporte = ${id}`)
      .leftJoinAndMapMany('reportes.observaciones', Observacion, 'observacion', 'observacion.reporteIdReporte = reportes.idReporte')
      .orderBy('reportes.fechaRegistro', 'DESC')
      .leftJoinAndMapMany('observacion.imagenes', ObservacionImagen, 'imagenes', 'imagenes.observacionIdObservacion = observacion.idObservacion')
      .leftJoinAndMapMany('observacion.comentarios', ObservacionComentario, 'comentarios', 'comentarios.observacionIdObservacion = observacion.idObservacion')
      .leftJoinAndMapMany('reportes.firmas', FirmasReporte, 'firmasReporte', 'firmasReporte.reporteId = reportes.idReporte ')
      .leftJoinAndMapMany('reportes.hoteles', Hoteles, 'hoteles', 'hoteles.idHotel = reportes.hotelId ')
      .leftJoinAndMapMany('reportes.usuario', User, 'usuario', 'usuario.idUsuario = reportes.userId ')
      .getMany();


    if (!reporteFound) {
      return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
    } else {
      return queyView;
    }
  }

  async listarReportePorIdSinExecption(id: number) {
    const userFound = await this.reporteRepositorio.findOne({
      where: {
        idReporte: id,
      },
    });
    return userFound;
  }

  async crearReporte(reporte: crearReporteDto) {
    const userFound = await this._user.listarUsuarioPorIdSinException(
      reporte.userId,
    );
    const hotelFound = await this._hotel.listarHotelPorIdSinException(
      reporte.hotelId,
    );

    if (!userFound) {
      return new HttpException('Usuario no exontrado', HttpStatus.NOT_FOUND);
    }
    if (!hotelFound) {
      return new HttpException('Hotel no exontrado', HttpStatus.NOT_FOUND);
    }

    const newReport = this.reporteRepositorio.create(reporte);
    console.log(newReport);

    const saveReporte = await this.reporteRepositorio.save(newReport);
    console.log(saveReporte);

    newReport.usuario = userFound;
    newReport.hoteles = hotelFound;

    return this.reporteRepositorio.save(saveReporte);
  }

  async editarReporte(id: number, reporte: editarReporteDto) {
    const reporteFound = await this.reporteRepositorio.findOne({
      where: {
        idReporte: id,
      },
    });
    if (!reporteFound) {
      return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateReporte = Object.assign(reporteFound, reporte);
      return this.reporteRepositorio.save(updateReporte);
    }
  }

  async eliminarReporte(id: number) {
    const reporteFound = await this.listarReportePorIdSinExecption(
      id,
    );
    if (!reporteFound) {
      return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
    } else {
      const queyView = await this.reporteRepositorio
        .createQueryBuilder('reportes')
        .where(`reportes.idReporte = ${id}`)
        .leftJoinAndMapMany('reportes.observaciones', Observacion, 'observacion', 'observacion.reporteIdReporte = reportes.idReporte')
        .getMany();
      const queyViewFirmas = await this.reporteRepositorio
        .createQueryBuilder('reportes')
        .where(`reportes.idReporte = ${id}`)
        .leftJoinAndMapMany('reportes.firmasReporte', FirmasReporte, 'firmas', 'firmas.reporteFIdReporte = reportes.idReporte')
        .getMany();
      const firmas = queyViewFirmas[0].firmasReporte
      firmas.forEach(async (element) => {
        this.eliminarFirma(element.idFirmaReporte, element.path)
      });
      const observaciones = queyView[0].observaciones
      observaciones.forEach(async (element) => {
        this._observaciones.eliminarObservacion(element.idObservacion)
      });
      const result = await this.reporteRepositorio.delete({ idReporte: id });
      return new HttpException('Reporte eliminado', HttpStatus.ACCEPTED)
    }
  }

  async crearFirma(firma: crearFirmaDto, file) {
    const reporteFound = await this.listarReportePorIdSinExecption(
      firma.reporteId,
    );
    if (!reporteFound) {
      return new HttpException('Reporte no encontrado', HttpStatus.NOT_FOUND);
    }
    console.log(file);

    const path = `${firma.reporteId}/firmas/` + this._up.returnNameDateType(file['mimetype'])
    const fileUP = await this._aws.upPublicFile(file.buffer, path);
    firma.path = path
    firma.url = fileUP.Location;
    firma.nombreArchivo = fileUP.Key;
    const newFirma = this.firmasRepositorio.create(firma);
    const saveFima = await this.firmasRepositorio.save(newFirma);
    newFirma.reporteF = reporteFound;
    return this.firmasRepositorio.save(saveFima);
  }

  async eliminarFirma(id: number, path: string) {
    if (!id) {
      return new HttpException('Id no recibido', HttpStatus.NOT_FOUND);
    }

    const newImgObs = await this.firmasRepositorio.findOne({
      where: {
        idFirmaReporte: id,
      },
    });

    if (!newImgObs) {
      return new HttpException(
        'No hay datos en la base de datos',
        HttpStatus.NOT_FOUND,
      );
    } else {
      const res = await this.firmasRepositorio.delete({
        idFirmaReporte: id,
      });

      if (res.affected === 0) {
        return new HttpException('Firma no encontrada', HttpStatus.NOT_FOUND);
      } else {
        return this._up.deleteBucket(path);
      }
    }
  }

  secondExample(info: any) {
    const data = info;
    const options = {
      format: 'Tabloid',
      displayHeaderFooter: true,
      add_argument: ("--headless=new")
      // margin: {
      //   left: '10mm',
      //   top: '25mm',
      //   right: '10mm',
      //   bottom: '15mm',
      // },
      // landscape: true,
      // headerTemplate: `                    <div style="width: 100%; text-align: center;">
      // <span style="font-size: 20px;">
      //     <div class="col-1">
      //         <img class="me-3"
      //             src="https://d1.awsstatic.com/case-studies/PALACE-RESORTS.e292f526b6499fbee5de1bfd7430fda18e7c913a.png"
      //             alt="" width="48" height="38">

      //     </div>
      //     <div class="col-11" style="text-align: center;">
      //         <div class="lh-1">
      //             <h1 class="h6 mb-0 text-black lh-1">CORPORATIVO MANTENIMIENTO DE COCINAS
      //             </h1>
      //             <small>REVISIÓN DE EQUIPOS</small>
      //         </div>
      //     </div>

      //     </div>`, 

    };
    const filePath = path.join(process.cwd(), 'templates', 'pdf.hbs');;
    console.log('file', filePath);

    return this.createPdf(filePath, options, data);
  }

  async getTemplateHtml(info: any) {
    const data = info;

    console.log("Loading template file in memory")
    try {
      const invoicePath = path.join(process.cwd(), 'templates', 'index.html');
      return await readFile(invoicePath, 'utf8');
    } catch (err) {
      return Promise.reject("Could not load html template");
    }
  }

  generatePdf(indo: any) {
    let data = {};
    this.getTemplateHtml(indo).then(async (res) => {
      // Now we have the html code of our template in res object
      // you can check by logging it on console
      // console.log(res)
      console.log(res);

      console.log("Compiing the template with handlebars")
      const template = hb.compile(res, { strict: true });
      // we have compile our code with handlebars
      const result = template(data);
      // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
      const html = result;
      // we are using headless mode
      const browser = await puppeteer.launch(
        {
          add_argument: ("--headless=new"),
          args: [
            "--no-sandbox",
            "--disable-gpu",
          ]
        }
      );
      const page = await browser.newPage()
      // We set the page content as the generated html by handlebars
      await page.setContent(html)
      // We use pdf function to generate the pdf in the same folder as this file.
      await page.pdf({ path: 'invoice.pdf', format: 'A4' })
      await browser.close();
      console.log("PDF Generated")
    }).catch(err => {
      console.error(err)
    });
  }

  async generatepdf33() {
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.CHROMIUM_PATH,
      args: ['--no-sandbox',
        '--disable-setuid-sandbox',
        "--headless=new"
      ],
        
    });

    // Create a new page
    const page = await browser.newPage();

    // Website URL to export as pdf
    const website_url = 'https://www.bannerbear.com/blog/how-to-download-images-from-a-website-using-puppeteer/';

    // Open URL in current page
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // Downlaod the PDF
    const pdf = await page.pdf({
      path: 'result.pdf',
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    // Close the browser instance
    await browser.close();

    return pdf
  }
  async generarPDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument(
        {
          size: "LETTER",
          bufferPages: true
        })

      //todo
      doc.text("PDF Generado en nuestro servidor");
      doc.moveDown();
      doc.text("Esto es un ejemplo de como generar un pdf en nuestro servidor nestjs");


      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
      doc.end()


    })

    return pdfBuffer;

  }


  createPdf = async (filePath: string, options = {}, data = {}) => {
    try {
      const browser = await puppeteer.launch();
      if (browser) await browser.close()
      const page = await browser.newPage();

      hbs.registerHelper("ifCond", function (
        v1: any,
        operator: any,
        v2: any,
        options: any
      ) {
        switch (operator) {
          case "==":
            return v1 == v2 ? options.fn(data) : options.inverse(data);
          case "===":
            return v1 === v2 ? options.fn(data) : options.inverse(data);
          case "!=":
            return v1 != v2 ? options.fn(data) : options.inverse(data);
          case "!==":
            return v1 !== v2 ? options.fn(data) : options.inverse(data);
          case "<":
            return v1 < v2 ? options.fn(data) : options.inverse(data);
          case "<=":
            return v1 <= v2 ? options.fn(data) : options.inverse(data);
          case ">":
            return v1 > v2 ? options.fn(data) : options.inverse(data);
          case ">=":
            return v1 >= v2 ? options.fn(data) : options.inverse(data);
          case "&&":
            return v1 && v2 ? options.fn(data) : options.inverse(data);
          case "||":
            return v1 || v2 ? options.fn(data) : options.inverse(data);
          default:
            return options.inverse(options);
        }
      });

      hbs.registerHelper({
        eq: (v1: any, v2: any) => v1 === v2,
        ne: (v1: any, v2: any) => v1 !== v2,
        lt: (v1: number, v2: number) => v1 < v2,
        gt: (v1: number, v2: number) => v1 > v2,
        lte: (v1: number, v2: number) => v1 <= v2,
        gte: (v1: number, v2: number) => v1 >= v2,
        and() {
          return Array.prototype.every.call(arguments, Boolean);
        },
        or() {
          return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
        }
      });

      const html = await fs.readFile(filePath, 'utf8');
      const content = hbs.compile(html)(data);
      await page.setContent(content);

      const buffer = await page.pdf({
        // path: 'output-abc.pdf',
        format: 'a4',
        printBackground: true,
        margin: {
          left: '10mm',
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
        },
        ...options,
      });
      await browser.close();
      // process.exit();
      return buffer;
    } catch (e) {
      console.log(e);
    }
  };

}
