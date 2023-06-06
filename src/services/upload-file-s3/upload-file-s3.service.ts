/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as moment from 'moment';

@Injectable()
export class UploadFileS3Service {
    bucketName = 'imgrevision';
    s3 = new S3({
      accessKeyId: '',
      secretAccessKey: '',
    });

    async upPublicFile(databufer: Buffer, filename: string) {
        try {
          const uploadResult = await this.s3
            .upload({
              Bucket: this.bucketName,
              Body: databufer,
              Key: `${filename}`,
              ACL: 'public-read',
              ContentDisposition: 'inline',
            })
            .promise();
          return uploadResult;
        } catch (err) {
          console.log(err);
        }
      }

      async deleteBucket(fileName:string){
        const params = {
          Bucket: this.bucketName,
          Key: fileName
          /* 
             where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
             - full path name to your file without '/' at the beginning
          */
        };
        
        return this.s3.deleteObject(params).promise();

      }
      returnNameDateType(type:string,){
        const imageMimes = [
          {
            mime: 'image/png',
            return:'.png',
            pattern: [0x89, 0x50, 0x4e, 0x47]
          },
          {
            mime: 'image/jpeg',
            return:'.jpg',
            pattern: [0xff, 0xd8, 0xff]
          },
          {
            mime: 'image/gif',
            return:'.gif',
            pattern: [0x47, 0x49, 0x46, 0x38]
          },
          {
            mime: 'application/pdf',
            return: '.pdf',
            pattern: [0x52, 0x49, 0x46, 0x46, undefined, undefined, undefined, undefined, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50],
          }
          // You can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
        ];

        console.log(type);
        
        const infoReturn = Math.floor(Math.random() * 100) + moment(new Date()).format("YYYY-MM-DD-HH:mm:ss")+[...imageMimes].filter(m => m.mime === type)[0].return
        console.log(infoReturn);
        
        return infoReturn
          

        // console.log([...imageMimes].filter(m => m.mime === type));
          
      }
}
