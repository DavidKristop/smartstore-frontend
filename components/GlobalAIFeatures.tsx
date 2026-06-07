'use client';

import { useState, useRef } from "react";
import { executeDeepResearch } from "@/lib/actions/ai.actions";
import { getFiles } from "@/lib/actions/file.actions";
import { File_ } from "@/types";
import { Mic, Square, Link as LinkIcon, Loader2, Sparkles, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function GlobalAIFeatures() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [globalAiResult, setGlobalAiResult] = useState<any>(null);

    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState("");

    const [showResearchModal, setShowResearchModal] = useState(false);
    const [selectedResearchFiles, setSelectedResearchFiles] = useState<File_[]>([]);
    const [researchTopic, setResearchTopic] = useState("");
    const [workspaceFiles, setWorkspaceFiles] = useState<File_[]>([]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleWebToDrive = async (e: React.FormEvent) => {
        e.preventDefault(); if (!urlInput.trim()) return;
        setIsProcessing(true);
        try {
            const res = await fetch('/api/ai/web-to-drive', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: urlInput }) });
            const data = await res.json();
            setGlobalAiResult({ type: 'web-to-drive', data });
            setShowUrlInput(false); setUrlInput("");
        } catch (err) { alert("Grounding fault."); } finally { setIsProcessing(false); }
    };

    const openResearchModal = async () => {
        setIsProcessing(true);
        try {
            const fetchedFiles = await getFiles({ types: [], limit: 100 });
            setWorkspaceFiles(fetchedFiles.documents);
            setShowResearchModal(true);
        } catch (error) {
            console.error("Failed to load workspace files.");
        } finally {
            setIsProcessing(false);
        }
    };

    const runFolderDeepResearch = async () => {
        if (selectedResearchFiles.length === 0) return;
        setIsProcessing(true); setShowResearchModal(false);
        try {
            const data = await executeDeepResearch(selectedResearchFiles, researchTopic);
            setGlobalAiResult({ type: 'deep-research', data });
        } catch (err) { alert("Synthesis dropped."); } finally { setIsProcessing(false); }
    };

    const startRecording = async () => {
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setIsProcessing(true);
            const formData = new FormData(); formData.append('file', audioBlob, 'voice.webm');
            const res = await fetch('/api/ai/docs-live', { method: 'POST', body: formData });
            const data = await res.json();
            setGlobalAiResult({ type: 'docs-live', data });
        };
        mediaRecorder.start(); setIsRecording(true);
    };

    const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };
    const toggleResearchFileSelection = (file: File_) => setSelectedResearchFiles(prev => prev.find(f => f.$id === file.$id) ? prev.filter(f => f.$id !== file.$id) : [...prev, file]);

    return (
        <>
            <div className="hidden sm:flex items-center gap-3">
                <button onClick={openResearchModal} className="flex-center gap-2 btn-secondary px-5 h-[44px] rounded-full text-sm font-medium border light-border shadow-sm transition-all duration-200 cursor-pointer hover:bg-brand hover:border-brand">
                    <Layers className="h-4 w-4 text-brand" /> Deep Research
                </button>
                <button onClick={() => setShowUrlInput(!showUrlInput)} className="flex-center gap-2 btn-secondary px-5 h-[44px] rounded-full text-sm font-medium border light-border shadow-sm transition-all duration-200 cursor-pointer hover:bg-brand hover:border-brand">
                    <LinkIcon className="h-4 w-4 text-brand" /> Web Grounding
                </button>
            </div>

            {showUrlInput && (
                <div className="fixed top-24 right-10 w-80 bg-white border light-border shadow-xl rounded-2xl p-4 z-50">
                    <form onSubmit={handleWebToDrive} className="space-y-3">
                        <input type="url" required value={urlInput} onChange={(e)=>setUrlInput(e.target.value)} placeholder="Paste link..." className="w-full bg-light-800 p-3 rounded-xl border-transparent outline-none text-xs"/>
                        <button type="submit" className="primary-btn h-[40px] w-full rounded-xl text-xs cursor-pointer">Run Extract</button>
                    </form>
                </div>
            )}

            <Dialog open={showResearchModal} onOpenChange={setShowResearchModal}>
                <DialogContent className="shad-dialog p-6">
                    <DialogHeader><DialogTitle className="h3-bold text-dark-100 flex items-center gap-2"><Layers className="text-brand"/> Deep Research</DialogTitle></DialogHeader>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar border light-border rounded-xl p-2 bg-light-800 space-y-1">
                        {workspaceFiles.map((file: any) => (
                            <label key={file.$id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer text-xs font-medium text-dark-300">
                                <input type="checkbox" checked={!!selectedResearchFiles.find(f => f.$id === file.$id)} onChange={() => toggleResearchFileSelection(file)} className="accent-brand" />
                                <span className="truncate">{file.name}</span>
                            </label>
                        ))}
                    </div>
                    <input type="text" value={researchTopic} onChange={(e)=>setResearchTopic(e.target.value)} className="w-full bg-light-800 border light-border p-3 rounded-xl text-xs mt-4" placeholder="Synthesis Topic..."/>
                    <div className="flex gap-2 mt-4">
                        <button onClick={()=>setShowResearchModal(false)} className="w-1/2 bg-light-700 py-2 rounded-xl text-xs font-semibold cursor-pointer">Cancel</button>
                        <button onClick={runFolderDeepResearch} disabled={selectedResearchFiles.length === 0} className="w-1/2 primary-btn py-2 rounded-xl text-xs disabled:opacity-40 cursor-pointer">Run Synthesis</button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
                <button onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording} className={`h-[64px] w-[64px] rounded-full flex-center shadow-drop-2 transition-all active:scale-95 cursor-pointer ${isRecording ? 'bg-red animate-pulse' : 'bg-dark-200 text-white'}`}>{isRecording ? <Square className="h-5 w-5 fill-white text-white"/> : <Mic className="h-5 w-5"/>}</button>
                <span className="caption text-dark-300 font-medium bg-white/80 border light-border px-4 py-1 rounded-full backdrop-blur-sm shadow-sm">Hold for Docs Live</span>
            </div>

            <Dialog open={isProcessing} onOpenChange={() => {}}>
                <DialogContent className="max-w-md p-8 flex flex-col items-center gap-4 outline-none border-none shadow-none bg-transparent">
                    <VisuallyHidden><DialogTitle>Processing Request</DialogTitle></VisuallyHidden>
                    <Loader2 className="h-12 w-12 animate-spin text-brand" />
                    <p className="subtitle-2 text-white bg-dark-100/50 px-4 py-2 rounded-full backdrop-blur-sm">Processing Workspace Request...</p>
                </DialogContent>
            </Dialog>

            <Dialog open={!!globalAiResult} onOpenChange={() => setGlobalAiResult(null)}>
                <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-8">
                    <VisuallyHidden><DialogTitle>AI Output Analysis</DialogTitle></VisuallyHidden>
                    {globalAiResult?.type === 'web-to-drive' && <div className="space-y-4"><h2 className="h1-bold text-dark-100">{globalAiResult.data.title}</h2><div className="markdown text-dark-300 whitespace-pre-wrap leading-relaxed border-t light-border pt-4">{globalAiResult.data.markdown_content}</div></div>}
                    {globalAiResult?.type === 'docs-live' && <div className="space-y-4"><h3 className="subtitle-2 text-brand uppercase tracking-widest flex items-center gap-2"><Sparkles className="h-4 w-4"/> Voice Output</h3><div className="p-5 border light-border rounded-xl bg-light-800 space-y-3 body-2"><p>"{globalAiResult.data.transcription}"</p><p>Intent: <span className="font-mono text-xs px-2 py-0.5 bg-dark-200 text-white rounded">{globalAiResult.data.detected_intent}</span></p><div className="border-t mt-3 pt-3 text-dark-400 font-mono text-xs max-h-40 overflow-y-auto">{JSON.stringify(globalAiResult.data.extracted_keywords)}</div></div></div>}
                    {globalAiResult?.type === 'deep-research' && <div className="space-y-6"><div className="flex items-center gap-2 h3-bold text-dark-100 border-b pb-4"><Layers className="text-brand"/> {globalAiResult.data.report_title}</div><div className="p-4 rounded-xl bg-light-800 text-sm leading-relaxed text-dark-300 italic">"{globalAiResult.data.executive_summary}"</div><div className="space-y-4">{globalAiResult.data.unified_findings?.map((item: any, idx: number) => <div key={idx} className="p-5 rounded-xl border light-border bg-white shadow-sm space-y-2"><h5 className="font-bold text-dark-200 text-sm">{item.concept}</h5><p className="caption text-neutral-500 leading-relaxed">{item.details}</p></div>)}</div>{globalAiResult.data.mermaid_chart_code && <div className="space-y-2 border-t pt-4"><h4 className="caption text-light-400 uppercase font-bold">Mermaid.js Output:</h4><pre className="p-4 bg-dark-200 text-brand font-mono text-xs rounded-xl overflow-x-auto">{globalAiResult.data.mermaid_chart_code}</pre></div>}</div>}
                    <div className="mt-6 border-t light-border pt-4"><button onClick={() => setGlobalAiResult(null)} className="btn-secondary w-full py-2 rounded-full text-dark-100 font-semibold hover:bg-light-700 cursor-pointer">Close Frame</button></div>
                </DialogContent>
            </Dialog>
        </>
    );
}