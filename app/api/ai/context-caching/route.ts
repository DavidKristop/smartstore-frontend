import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import os from "os";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
    let tempFilePath = "";

    try {
        const { fileUrl, mimeType, userQuestion } = await req.json();

        if (!fileUrl || !userQuestion) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const fileMimeType = mimeType || "application/pdf";

        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Failed to fetch file from Appwrite.");

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        tempFilePath = path.join(os.tmpdir(), `temp-doc-${Date.now()}.tmp`);
        fs.writeFileSync(tempFilePath, buffer);

        const uploadResult = await ai.files.upload({
            file: tempFilePath,
            config: {
                mimeType: fileMimeType,
            }
        });

        const systemInstruction = `
            You are the SmartShare AI Document Assistant. 
            [INTENT MAPPING]:
            - If asked for a summary, extract key topics and use bullet points.
            - If asked a specific question, answer using ONLY the document provided.
            - NEVER say "As an AI, I cannot access files."
            - Be conversational, professional, and concise.
        `;

        const chatResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
                { fileData: { mimeType: fileMimeType, fileUri: uploadResult.uri } },
                { text: userQuestion }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1,
            }
        });

        return NextResponse.json({ answer: chatResponse.text });

    } catch (error: any) {
        console.error("[Context Caching Error]:", error);
        return NextResponse.json({ error: "Failed to analyze document natively." }, { status: 500 });
    } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
}