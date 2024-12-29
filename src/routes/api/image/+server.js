import OpenAI from "openai";
import dotenv from 'dotenv';
import { json } from '@sveltejs/kit';

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST({ request }) {
    try {

        // TO SEE WHICH MODELS IS ACCESSIBLE 
        // const list = await openai.models.list();

        // for await (const model of list) {
        //     console.log(model);
        // }
        const { refinedPrompt } = await request.json();
        console.log("Prompt: ", refinedPrompt);

        if (!refinedPrompt || typeof refinedPrompt !== 'string') {
            return json(
                { error: 'Invalid or missing "prompt" in request body.' },
                { status: 400 }
            );
        }

        const response = await openai.images.generate({
            prompt: refinedPrompt,
            n: 1,
            // size: '512x512',
            model: "dall-e-3", 
        });

        const imageUrl = response.data[0].url;

        return json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);

        if (error.response) {
            return json(
                { error: error.response.data.error.message || 'OpenAI API error.' },
                { status: error.response.status }
            );
        }
        return json({ error: 'Failed to generate image.' }, { status: 500 });
    }
}