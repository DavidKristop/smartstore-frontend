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
        const file = formData.get('file') as File;
        const safeMimeType = file.type || 'text/plain';

        const buffer = Buffer.from(await file.arrayBuffer());
        tempPath = path.join(os.tmpdir(), `${uuidv4()}_${file.name}`);
        await writeFile(tempPath, buffer);

        const uploadedFile = await ai.files.upload({ file: tempPath, config: { mimeType: safeMimeType }});
        uploadedDocName = uploadedFile.name || "";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [
                "Run this code file directly in your isolated sandbox environment. Output console values and evaluate errors.",
                { fileData: { fileUri: uploadedFile.uri, mimeType: uploadedFile.mimeType } }
            ],
            config: {
                tools: [{ codeExecution: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { analysis: { type: Type.STRING }, execution_output: { type: Type.STRING }, suggested_fix: { type: Type.STRING } },
                    required: ["analysis", "execution_output", "suggested_fix"]
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