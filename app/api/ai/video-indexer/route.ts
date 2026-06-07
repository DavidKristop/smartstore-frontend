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
        const videoFile = formData.get('video') as File;
        const safeMimeType = videoFile.type || 'video/mp4';

        const buffer = Buffer.from(await videoFile.arrayBuffer());
        tempPath = path.join(os.tmpdir(), `${uuidv4()}_${videoFile.name}`);
        await writeFile(tempPath, buffer);

        const uploadedVideo = await ai.files.upload({ file: tempPath, config: { mimeType: safeMimeType }});
        uploadedDocName = uploadedVideo.name || "";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                "Generate structured timestamped lecture chapters based on video track changes.",
                { fileData: { fileUri: uploadedVideo.uri, mimeType: uploadedVideo.mimeType } }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        lecture_title: { type: Type.STRING },
                        chapters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { timestamp: { type: Type.STRING }, chapter_title: { type: Type.STRING }, detailed_summary: { type: Type.STRING } }, required: ["timestamp", "chapter_title", "detailed_summary"] } }
                    },
                    required: ["lecture_title", "chapters"]
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