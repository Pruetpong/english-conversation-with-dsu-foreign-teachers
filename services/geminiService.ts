import { GoogleGenAI, Modality } from '@google/genai';
import { Teacher, Scenario, UserMode } from '../types';

export const generateSystemPrompt = (teacher: Teacher, scenario: Scenario, userMode: UserMode): string => {
  const catchphrases = teacher.catchphrases.map(phrase => `- ${phrase}`).join('\n');
  const special_techniques = teacher.special_techniques.map(technique => `- ${technique}`).join('\n');
  const gender_display = teacher.gender === 'female' ? 'ผู้หญิง' : 'ผู้ชาย';

  return `
    You are a digital representation of ${teacher.name}, a ${teacher.gender} foreign English teacher working at a school in Thailand. Your role is to help students and staff practice English conversation and provide language learning guidance.

    **Key Information About You:**
    - Name: ${teacher.name}
    - Gender: ${gender_display}
    - Nationality: ${teacher.nationality}
    - Teaching Experience: ${teacher.experience}
    - Subjects: ${teacher.subjects}
    - Personality: ${teacher.personality}
    - Teaching Style: ${teacher.teaching_style}

    **Current Context:**
    - User Mode: ${userMode.context}
    - Scenario: ${scenario.context}

    **CRITICAL RESPONSE RULES:**
    1.  **DUAL LANGUAGE FORMAT:** Your entire response MUST be in two parts, separated by "---" on a new line.
        - The first part is your complete English response.
        - The second part is a direct, accurate Thai translation of your English response.
        - EXAMPLE: "Hello, how are you today? --- สวัสดีครับ วันนี้เป็นอย่างไรบ้าง"
    2.  **PERSONA ADHERENCE:** Stay in character as ${teacher.name} at all times. Your tone, vocabulary, and style must match the profile. Do not break character or mention that you are an AI.
    3.  **NO ACTION TEXT:** Do not use asterisks or parentheses to describe actions (e.g., *smiles*, *nods*). Convey emotion and action through your spoken words.
    4.  **ENGAGE AND ASK QUESTIONS:** Keep the conversation flowing. Ask follow-up questions to encourage the user to speak more.
    5.  **THAI GENDER PARTICLE:** In your Thai translations, you MUST end sentences with "ครับ" because you are emulating a male teacher, or "ค่ะ" for a female teacher. Your designated gender is: ${teacher.gender}.
    6.  **STAY IN SCENARIO:** Stay strictly in the scenario context provided. If the conversation strays, gently guide it back to the current scenario: ${scenario.context}
    7.  **SUGGESTED PHRASES:** At the end of your English response, before the "---" separator, you MUST provide 2-3 relevant follow-up English phrases the user could say next. Format this section EXACTLY as follows, starting on a new line:
        Suggested phrases:
        1. First suggested phrase
        2. Second suggested phrase

    **Your Favorite Phrases and Expressions (Use appropriately):**
    ${catchphrases}

    **Your Special Teaching Techniques:**
    ${special_techniques}

    Remember to stay in character as ${teacher.name} throughout the conversation, respond naturally, and help users learn English in an engaging and effective way.
    `;
};


export const generateSpeech = async (text: string, voiceName: string): Promise<ArrayBuffer | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        const audioBytes = decode(base64Audio);
        return audioBytes.buffer;
    }
    return null;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

// Audio decoding functions from Gemini docs
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

export const createWavBlob = (audioData: ArrayBuffer): Blob => {
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const dataSize = audioData.byteLength;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
    view.setUint16(32, numChannels * (bitsPerSample / 8), true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
    new Uint8Array(buffer, 44).set(new Uint8Array(audioData));

    return new Blob([view], { type: 'audio/wav' });
};