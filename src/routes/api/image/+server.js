import OpenAI from "openai";
// import dotenv from 'dotenv';
import { json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPEN_API_KEY,
});

// cloudinary Configuration
cloudinary.config({
    cloud_name: 'dtt2i5tjs',
    api_key: '386898758911596',
    api_secret: import.meta.env.VITE_CLOUDINARY_API
});

export async function POST({ request }) {
    try {

        // TO SEE WHICH MODELS ARE ACCESSIBLE:
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
            model: "dall-e-3",
            size: "1024x1024",
        });

        let imageUrl = response.data[0].url;
        console.log("OpenAI Blob URL:", imageUrl);

        // Upload 
        const uploadResult = await cloudinary.uploader
        .upload(
            imageUrl
        )
        .catch((error) => {
            console.log(error);
        });
        console.log(uploadResult);
        const result = JSON.stringify(uploadResult);
        return new Response(result);

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