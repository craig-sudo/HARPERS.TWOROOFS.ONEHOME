import { GoogleGenAI, Type } from "@google/genai";
import {
    ChildFirstCoachResponse,
    StructuredActionLogResponse,
    DocumentAnalyzerResponse,
    EvidenceProcessorResponse,
    ScheduleOptimizerResponse,
    ExpenseCategorizerResponse,
    SleepAssistantResponse,
    EvidenceCategory,
    ExpenseCategory,
} from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const NB_LAW_CONTEXT = "As an expert in New Brunswick Family Law, your primary directive is the 'Child's Best Interest'. All outputs must prioritize the child's stability, safety, and well-being. Your goal is to produce objective, verifiable, and unalterable documentation for court compliance, demonstrating accountability and child-centric advocacy.";

// --- Helper for parsing JSON safely ---
function parseJsonResponse<T,>(text: string): T {
    try {
        const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse JSON response:", text);
        throw new Error("The AI returned an invalid response format.");
    }
}

// 1. Child-First Coach
export async function getImprovedCommunication(message: string): Promise<ChildFirstCoachResponse> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Original message: "${message}". Please revise this message to be collaborative and child-focused. Also provide a list of key changes explaining the reasoning for each revision.`,
        config: {
            systemInstruction: `${NB_LAW_CONTEXT} You are the Child-First Coach. Rewrite accusatory language into collaborative, child-focused statements to satisfy 'good faith efforts' metrics.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    revisedMessage: { type: Type.STRING, description: "The revised, child-focused message." },
                    keyChanges: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Objective reasons for each revision." }
                }
            }
        }
    });
    return parseJsonResponse<ChildFirstCoachResponse>(response.text);
}

// 2. Structured Action Log
export async function createStructuredAction(text: string): Promise<StructuredActionLogResponse> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the following co-parenting chat message(s) and extract a single, clear, actionable item: "${text}"`,
        config: {
            systemInstruction: `${NB_LAW_CONTEXT} You are the Structured Action Log assistant. Your job is to turn informal chat requests into formally logged, actionable proposals to create an immutable communication record. Identify the core action being requested or proposed.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A concise title for the action item (e.g., 'Confirm dentist appointment')." },
                    type: { type: Type.STRING, description: "The category of the action (e.g., 'Scheduling', 'Decision', 'Information Request')." },
                    details: { type: Type.STRING, description: "A detailed, neutral description of the proposed action." }
                }
            }
        }
    });
    return parseJsonResponse<StructuredActionLogResponse>(response.text);
}

// 3. Document Analyzer (Text)
export async function analyzeDocumentText(textContent: string): Promise<DocumentAnalyzerResponse> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Analyze the following text content and extract key information. Content: "${textContent}"`,
        config: {
            systemInstruction: `${NB_LAW_CONTEXT} You are a Document Analyzer. Your role is to extract and categorize key facts for the Evidence Log, proving due diligence and creating a court-ready index of events. Provide a factual summary, a title, and a category.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: "A brief, factual summary of the document's content." },
                    suggestedTitle: { type: Type.STRING, description: "A concise, descriptive title for the evidence log." },
                    suggestedCategory: { type: Type.STRING, enum: Object.values(EvidenceCategory), description: "The most appropriate category for this document." }
                }
            }
        }
    });
    return parseJsonResponse<DocumentAnalyzerResponse>(response.text);
}


// 4. Evidence Processor (Image)
export async function processEvidenceImage(imageDataUri: string, mimeType: string): Promise<EvidenceProcessorResponse> {
    const base64Data = imageDataUri.split(',')[1];
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: mimeType
        }
    };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: "Analyze this image. If it contains text, extract it. Then, provide a factual summary of the image's content, a suggested title for an evidence log, and a category. If OCR is performed, also provide an OCR confidence score between 0.0 and 1.0." }
            ]
        },
        config: {
            systemInstruction: `${NB_LAW_CONTEXT} You are an Evidence Processor with OCR capabilities. Analyze the image to extract all text and provide a factual, objective description for a verifiable evidence log.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    extractedText: { type: Type.STRING, description: "All text extracted from the image. If no text, state 'No text found'." },
                    summary: { type: Type.STRING, description: "A brief, factual summary of the image's content (e.g., 'Receipt from Shoppers Drug Mart')." },
                    suggestedTitle: { type: Type.STRING, description: "A concise, descriptive title for the evidence log." },
                    suggestedCategory: { type: Type.STRING, enum: Object.values(EvidenceCategory), description: "The most appropriate category for this evidence." },
                    ocrConfidence: { type: Type.NUMBER, description: "A confidence score from 0.0 to 1.0 for the OCR accuracy. Omit if not applicable." }
                }
            }
        }
    });
    return parseJsonResponse<EvidenceProcessorResponse>(response.text);
}


// 5. Schedule Optimizer
export async function getOptimizedSchedule(parentalNeeds: string, childWellbeingFactors: string, externalFactors: string): Promise<ScheduleOptimizerResponse> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `Generate an optimized parenting schedule considering these factors:\n- Parental Needs: ${parentalNeeds}\n- Child's Wellbeing Factors: ${childWellbeingFactors}\n- External Factors: ${externalFactors}`,
        config: {
            systemInstruction: `${NB_LAW_CONTEXT} You are a Schedule Optimizer. Explicitly apply the highest standard: 'best interest of the child'. Create a detailed weekly or bi-weekly parenting plan that considers the child's routines, activities, and stability above all else. Provide clear reasoning.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    optimizedSchedule: { type: Type.STRING, description: "The detailed weekly/bi-weekly plan, often in a markdown table format." },
                    reasoning: { type: Type.STRING, description: "A clear explanation of how this schedule serves the child's best interest based on the provided factors." }
                }
            }
        }
    });
    return parseJsonResponse<ScheduleOptimizerResponse>(response.text);
}

// 6. Expense Categorizer
export async function categorizeExpense(prompt: string): Promise<ExpenseCategorizerResponse> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Categorize the following expense: "${prompt}"`,
        config: {
            systemInstruction: `${NB_LAW_CONTEXT} You are an Expense Categorizer. Your purpose is to provide financial transparency for co-parenting. Categorize costs according to the child's needs for accurate reporting and contribution tracking. Extract the amount and currency if present.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, enum: Object.values(ExpenseCategory), description: "The most appropriate category for the expense." },
                    amount: { type: Type.NUMBER, description: "The numerical amount of the expense, if found." },
                    currency: { type: Type.STRING, description: "The currency of the expense (e.g., CAD), if found." }
                }
            }
        }
    });
    return parseJsonResponse<ExpenseCategorizerResponse>(response.text);
}

// 7. Sleep Assistant
export async function getSleepSchedule(ageInMonths: number, recentLogs: string, desiredSchedule: string): Promise<SleepAssistantResponse> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a sleep schedule recommendation based on the following:\n- Child's Age: ${ageInMonths} months\n- Recent Sleep Logs: "${recentLogs}"\n- Desired Schedule/Goals: "${desiredSchedule}"`,
        config: {
            systemInstruction: `You are a pediatric Sleep Assistant. Your goal is to support the child's developmental needs by providing consistent and expert-informed sleep advice. Focus on creating a stable and predictable routine.`,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestedSchedule: { type: Type.STRING, description: "A detailed suggested daily sleep schedule, including wake-up, naps, and bedtime." },
                    nextNapTime: { type: Type.STRING, description: "The suggested time for the next nap based on the logs." },
                    sleepTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of actionable tips to improve the child's sleep." }
                }
            }
        }
    });
    return parseJsonResponse<SleepAssistantResponse>(response.text);
}