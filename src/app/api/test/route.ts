import {
    AgentKit,
    CdpWalletProvider,
    wethActionProvider,
    walletActionProvider,
    erc20ActionProvider,
    cdpApiActionProvider,
    cdpWalletActionProvider,
    pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { NextResponse } from 'next/server';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { AgentExecutor } from "langchain/agents";
import { DallEAPIWrapper } from "@langchain/openai";
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


dotenv.config();

/* Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
    const missingVars: string[] = [];

    // Check required variables
    const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    // Exit if any required variables are missing
    if (missingVars.length > 0) {
        console.error("Error: Required environment variables are not set");
        missingVars.forEach(varName => {
            console.error(`${varName}=your_${varName.toLowerCase()}_here`);
        });
        process.exit(1);
    }

    // Warn about optional NETWORK_ID
    if (!process.env.NETWORK_ID) {
        console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
    }
}

// Add this right after imports and before any other code
validateEnvironment();

// Configure a file to persist the agent's CDP MPC Wallet Data
const WALLET_DATA_FILE = "wallet_data.txt";

/* Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent(request: GenerateRequest) {
    try {
        let llm: any;

        switch (request.type) {
            case 'text':
                llm = new ChatOpenAI({
                    model: "gpt-4o-mini",
                });
                break;
            case 'image':
                llm = new DallEAPIWrapper({
                    model: "dall-e-3",
                });
                break;
            case 'voice':
                llm = new ChatOpenAI({
                    model: "tts-1",
                });
                break;
            case 'video':
                // Handle video type if needed
                break;
            default:
                throw new Error("Invalid type");
        }

        const walletDataStr = `{"walletId":"adb7312c-ceea-45f4-b672-5792a1cf6539","seed":"a8acd867166eed5483107afe08fec5e445f7a48c1d671e714648ef53b15a846c","networkId":"base-sepolia"}`;


        // Configure CDP Wallet Provider

        const APP_NAME = 'Markdown Editor';
        const APP_LOGO_URL = 'https://your-app-logo.com/logo.png';
        const BASE_MAINNET_CHAIN_ID = 8453;
        const BASE_SEPOLIA_CHAIN_ID = 84532;
        const config = {
            apiKeyName: process.env.CDP_API_KEY_NAME,
            apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            cdpWalletData: walletDataStr ? JSON.parse(walletDataStr) : undefined,
            networkId: process.env.NETWORK_ID || "base-sepolia",
        };

        const walletProvider = await CdpWalletProvider.configureWithWallet(config);
        // Initialize AgentKit
        const agentkit = await AgentKit.from({
            walletProvider,
            actionProviders: [
                wethActionProvider(),
                pythActionProvider(),
                walletActionProvider(),
                erc20ActionProvider(),
                cdpApiActionProvider({
                    apiKeyName: process.env.CDP_API_KEY_NAME,
                    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                }),
                cdpWalletActionProvider({
                    apiKeyName: process.env.CDP_API_KEY_NAME,
                    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                }),
            ],
        });

        const tools = await getLangChainTools(agentkit);


        // Store buffered conversation history in memory
        const memory = new MemorySaver();
        const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

        // Create React Agent using the LLM and CDP AgentKit tools
        const agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: `
          You are a helpful agent 
          `,
        });

        // Save wallet data
        const exportedWallet = await walletProvider.exportWallet();
        fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

        return { agent, config: agentConfig, tools };
    } catch (error) {
        console.error("Failed to initialize agent:", error);
        throw error; // Re-throw to be handled by caller
    }
}
// Define request body type
interface GenerateRequest {
    type: 'text' | 'image' | 'voice' | 'video';
    bot: string;
    prompt: string;
}
export async function POST(request: Request) {
    try {
        // Parse request body
        const body: GenerateRequest = await request.json();
        const { type, bot, prompt } = body;
        const { agent, config, tools } = await initializeAgent(body);

        const thought = prompt

        const response = await agent.invoke({ messages: [new HumanMessage(thought)] }, config);


        switch (type) {
            case 'text': {
                return NextResponse.json({
                    content: response.messages[1].content,

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


    } catch (error) {
        return NextResponse.json({
            error,
        });
    }
}