import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { writeFile, unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import os from 'os';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
    let uploadedDocName = ""; let tempPath = "";
    try {
        const formData = await req.formData();
        const audioFile = formData.get('file') as File;
        const safeMimeType = audioFile.type || 'audio/webm';

        const buffer = Buffer.from(await audioFile.arrayBuffer());
        tempPath = path.join(os.tmpdir(), `${uuidv4()}_voice.webm`);
        await writeFile(tempPath, buffer);

        const uploadedAudio = await ai.files.upload({ file: tempPath, config: { mimeType: safeMimeType }});
        uploadedDocName = uploadedAudio.name || "";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                "Analyze the audio voice command. Extract the direct user intent and any related keywords.",
                { fileData: { fileUri: uploadedAudio.uri, mimeType: uploadedAudio.mimeType } }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        transcription: { type: Type.STRING },
                        detected_intent: { type: Type.STRING },
                        extracted_keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["transcription", "detected_intent", "extracted_keywords"]
                }
            }
        });

        await ai.files.delete({ name: uploadedDocName });
        await unlink(tempPath);
        return NextResponse.json(JSON.parse(response.text || ""));

    } catch (error: any) {
        if (uploadedDocName) try { await ai.files.delete({ name: uploadedDocName }); } catch(e) {}
        if (tempPath) try { await unlink(tempPath); } catch(e) {}
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}