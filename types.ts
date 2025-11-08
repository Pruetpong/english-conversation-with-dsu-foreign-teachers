export interface Teacher {
  id: string;
  name: string;
  nationality: string;
  gender: 'male' | 'female';
  experience: string;
  subjects: string;
  personality: string;
  teaching_style: string;
  voice_profile: string; 
  catchphrases: string[];
  special_techniques: string[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  context: string;
}

export interface UserMode {
  id: string;
  name: string;
  description: string;
  context: string;
}

export enum Role {
  User = 'user',
  Assistant = 'assistant',
}

export interface Message {
  role: Role;
  content: string;
  timestamp: string;
  audioData?: ArrayBuffer | null;
  suggestions?: string[];
}

export interface Settings {
    teacherId: string;
    scenarioId: string;
    userModeId: string;
    temperature: number;
    maxTokens: number;
    useTTS: boolean;
}