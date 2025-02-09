import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define request body type
interface GenerateRequest {
  type: 'text' | 'image' | 'voice' | 'video';
  bot: string;
  prompt: string;
}

export const runtime = 'edge'; // Enable edge runtime

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: GenerateRequest = await request.json();
    const { type, bot, prompt } = body;

    switch (type) {
      case 'text': {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: `You are ${bot}, an AI assistant. Respond in a helpful and friendly manner.` 
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          stream: false,
        });

        return NextResponse.json({
          content: response.choices[0].message.content,
        });
      }

      case 'image': {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        });

        return NextResponse.json({
          url: response.data[0].url,
        });
      }

      case 'voice': {
        const response = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input: prompt,
        });

        // Convert the audio buffer to base64
        const audioBuffer = Buffer.from(await response.arrayBuffer());
        const audioBase64 = audioBuffer.toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

        return NextResponse.json({
          url: audioUrl,
        });
      }

      case 'video': {
        // Video generation is not supported
        return NextResponse.json({
          error: "Video generation is not supported",
        }, { status: 501 }); // 501 Not Implemented
      }

      default:
        return NextResponse.json({
          error: "Invalid generation type",
        }, { status: 400 }); // 400 Bad Request
    }
  } catch (error: any) {
    console.error('Generation error:', error);
    
    // Return appropriate error messages
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({
        error: "API quota exceeded. Please check your OpenAI API limits.",
      }, { status: 429 }); // 429 Too Many Requests
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json({
        error: "Invalid API key. Please check your OpenAI API configuration.",
      }, { status: 401 }); // 401 Unauthorized
    }

    return NextResponse.json({
      error: "An error occurred while generating content.",
      details: error.message
    }, { status: 500 }); // 500 Internal Server Error
  }
} 