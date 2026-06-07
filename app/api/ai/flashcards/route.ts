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
        const amount = formData.get('amount') as string || '10';

        const safeMimeType = file.type || 'application/pdf';
        const buffer = Buffer.from(await file.arrayBuffer());
        tempPath = path.join(os.tmpdir(), `${uuidv4()}_${file.name}`);
        await writeFile(tempPath, buffer);

        const uploadedDoc = await ai.files.upload({
            file: tempPath,
            config: { mimeType: safeMimeType }
        });
        uploadedDocName = uploadedDoc.name || "";

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
                `Extract the most important concepts, terms, and definitions from this document and create a deck of ${amount} high-quality flashcards. Keep the front brief (the term/question) and the back concise (the definition/answer).`,
                { fileData: { fileUri: uploadedDoc.uri, mimeType: uploadedDoc.mimeType } }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        deck_title: { type: Type.STRING },
                        cards: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    front: { type: Type.STRING },
                                    back: { type: Type.STRING }
                                },
                                required: ["front", "back"]
                            }
                        }
                    },
                    required: ["deck_title", "cards"]
                }
            }
        });

        await ai.files.delete({ name: uploadedDocName });
        await unlink(tempPath);

        const rawText = response.text || "";
        const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(cleanJson));

    } catch (error: any) {
        if (uploadedDocName) try { await ai.files.delete({ name: uploadedDocName }); } catch(e) {}
        if (tempPath) try { await unlink(tempPath); } catch(e) {}
        console.error("Flashcard Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}