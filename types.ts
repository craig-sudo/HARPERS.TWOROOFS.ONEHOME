

export enum EvidenceCategory {
    COMMUNICATION = 'Communication',
    FINANCIAL = 'Financial',
    HEALTH = 'Health',
    LEGAL = 'Legal',
    SCHOOL = 'School',
    OTHER = 'Other',
}

export enum ExpenseCategory {
    HEALTH = 'Health',
    EDUCATION = 'Education',
    EXTRACURRICULAR = 'Extracurricular',
    CLOTHING = 'Clothing',
    FOOD = 'Food',
    HOUSING = 'Housing',
    TRANSPORTATION = 'Transportation',
    OTHER = 'Other',
}

export interface ChildFirstCoachResponse {
    revisedMessage: string;
    keyChanges: string[];
}

export interface StructuredActionLogResponse {
    title: string;
    type: string;
    details: string;
}

export interface DocumentAnalyzerResponse {
    summary: string;
    suggestedTitle: string;
    suggestedCategory: EvidenceCategory;
}

export interface EvidenceProcessorResponse {
    extractedText: string;
    summary: string;
    suggestedTitle: string;
    suggestedCategory: EvidenceCategory;
    ocrConfidence?: number;
}

export interface ScheduleOptimizerResponse {
    optimizedSchedule: string;
    reasoning: string;
}

export interface ExpenseCategorizerResponse {
    category: ExpenseCategory;
    amount: number;
    currency: string;
}

export interface SleepAssistantResponse {
    suggestedSchedule: string;
    nextNapTime: string;
    sleepTips: string[];
}