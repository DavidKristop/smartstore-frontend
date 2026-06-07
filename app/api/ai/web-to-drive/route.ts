import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        if (!url) return NextResponse.json({ error: "Missing Target URL" }, { status: 400 });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Scrape and analyze: ${url}. Extract all major information directly into structured Markdown layout blocks.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING }, markdown_content: { type: Type.STRING } },
                    required: ["title", "markdown_content"]
                }
            }
        });
        return NextResponse.json(JSON.parse(response.text || ""));
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}