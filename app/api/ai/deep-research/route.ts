import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { writeFile, unlink } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import os from 'os';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
    const uploadedGenAiDocs: any[] = []; const tempFilesToClean: string[] = [];
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        const topic = formData.get('topic') as string;

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const tempPath = path.join(os.tmpdir(), `${uuidv4()}_${file.name}`);
            await writeFile(tempPath, buffer);
            tempFilesToClean.push(tempPath);

            const uploadedDoc = await ai.files.upload({ file: tempPath, config: { mimeType: file.type }});
            uploadedGenAiDocs.push({ fileData: { fileUri: uploadedDoc.uri, mimeType: uploadedDoc.mimeType } });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
                `Synthesize all provided cluster files into one master cross-referenced analytical profile focused on: ${topic}. Include a raw Mermaid diagram script framework string.`,
                ...uploadedGenAiDocs
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        report_title: { type: Type.STRING },
                        executive_summary: { type: Type.STRING },
                        unified_findings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { concept: { type: Type.STRING }, details: { type: Type.STRING } }, required: ["concept", "details"] } },
                        mermaid_chart_code: { type: Type.STRING }
                    },
                    required: ["report_title", "executive_summary", "unified_findings", "mermaid_chart_code"]
                }
            }
        });

        for (const doc of uploadedGenAiDocs) { try { await ai.files.delete({ name: doc.fileData.fileUri.split('/').pop() || '' }); } catch (e) {} }
        for (const filePath of tempFilesToClean) { try { await unlink(filePath); } catch (e) {} }
        return NextResponse.json(JSON.parse(response.text || ""));

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}