import { Injectable } from '@nestjs/common';
import * as  process from "process";
import OpenAI from 'openai';


@Injectable()
export class OpenaiService {


    // openai = new OpenAIApi(this.configuration)
    // private readonly openai: OpenAIApi
    constructor() {
        // const configuration = new Configuration({
        //     apiKey: process.env.API_OPEN,
        //     organization: process.env.API_ORG
        // })
        // this.openai = new OpenAIApi(configuration);
   
    }

    
    async correccionGramatical(info: any) {
        try {
            const openai = new OpenAI({
                apiKey: process.env.API_OPEN,
              });
            // const response = await this.openai.createCompletion({
            //     model: "text-davinci-003",
            //     prompt: `corrige gramaticalmente el siguiente texto ${info}`,
            //     temperature: 0,
            //     max_tokens: 256,
            //     top_p: 1,
            //     frequency_penalty: 0,
            //     presence_penalty: 0,
            // });

            const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: `corrige gramaticalmente el siguiente texto ${info}`,
            max_tokens: 256,
            });

              console.log(completion.choices[0].text.slice(1).split("\n").join(""));

            // console.log(chatCompletion.choices[0].message);

            // console.log(response['data']['choices'][0]['text']);
            
            return await completion.choices[0].text.slice(1).split("\n").join("")
        }
        catch (err) {
            console.log("error________",err);

        }
    }
}
