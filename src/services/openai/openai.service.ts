import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from "openai";
import * as  process from "process";

@Injectable()
export class OpenaiService {


    // openai = new OpenAIApi(this.configuration)
    private readonly openai: OpenAIApi
    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.API_OPEN,
            organization: 'org-5F6cEvWbXdDPnR5D2XMjezjV'
        })
        this.openai = new OpenAIApi(configuration);
    }
    async correccionGramatical(info: any) {
        try {
            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt: `corrige gramaticalmente el siguiente texto ${info}`,
                temperature: 0,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            console.log(response['data']['choices'][0]['text']);
            
            return await response['data']['choices'][0]['text'].slice(1).split("\n").join("")
        }
        catch (err) {
            console.log(err);

        }
    }
}
