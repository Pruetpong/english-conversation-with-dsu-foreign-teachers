
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Teacher, Scenario, UserMode, Message, Role, Settings } from './types';
import { TEACHERS, SCENARIOS, USER_MODES } from './constants';
import TeacherSelector from './components/TeacherSelector';
import SettingsPanel from './components/SettingsPanel';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { generateSystemPrompt, generateSpeech } from './services/geminiService';
import { LogoIcon, MenuIcon, XIcon } from './components/icons';

const parseResponseWithSuggestions = (responseText: string): { mainContent: string; suggestions: string[] } => {
  const suggestions: string[] = [];
  let mainContent = responseText;

  const suggestionsMarker = 'Suggested phrases:';
  const separator = '---';

  const markerIndex = responseText.indexOf(suggestionsMarker);
  
  if (markerIndex !== -1) {
    const englishPart = responseText.substring(0, markerIndex).trim();
    const rest = responseText.substring(markerIndex);
    
    const separatorIndexInRest = rest.indexOf(separator);
    
    if (separatorIndexInRest !== -1) {
      const suggestionsBlock = rest.substring(0, separatorIndexInRest)
        .replace(suggestionsMarker, '')
        .trim();
      
      const thaiPartWithSeparator = rest.substring(separatorIndexInRest);
      
      mainContent = `${englishPart}\n${thaiPartWithSeparator}`.trim();
      
      suggestionsBlock.split('\n').forEach(line => {
        const cleanedLine = line.replace(/^\d+\.\s*/, '').trim();
        if (cleanedLine) {
          suggestions.push(cleanedLine);
        }
      });
    } else {
      const suggestionsBlock = rest.replace(suggestionsMarker, '').trim();
       mainContent = englishPart;
       suggestionsBlock.split('\n').forEach(line => {
        const cleanedLine = line.replace(/^\d+\.\s*/, '').trim();
        if (cleanedLine) {
          suggestions.push(cleanedLine);
        }
      });
    }
  }

  return { mainContent, suggestions };
};


const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    teacherId: 'teacher_steven',
    scenarioId: 'general',
    userModeId: 'student',
    temperature: 0.7,
    maxTokens: 800,
    useTTS: true,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const chatRef = useRef<Chat | null>(null);

  const selectedTeacher = TEACHERS.find(t => t.id === settings.teacherId)!;
  
  useEffect(() => {
    chatRef.current = null;
    setMessages([]);
  }, [settings.teacherId, settings.scenarioId, settings.userModeId]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: Role.User,
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);

    const assistantMessagePlaceholder: Message = {
        role: Role.Assistant,
        content: '',
        timestamp: new Date().toISOString(),
        audioData: null,
        suggestions: [],
    };
    setMessages(prev => [...prev, assistantMessagePlaceholder]);

    try {
      if (!chatRef.current) {
        const teacher = TEACHERS.find(t => t.id === settings.teacherId)!;
        const scenario = SCENARIOS.find(s => s.id === settings.scenarioId)!;
        const userMode = USER_MODES.find(u => u.id === settings.userModeId)!;
        
        const systemPrompt = generateSystemPrompt(teacher, scenario, userMode);
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemPrompt,
            temperature: settings.temperature,
          },
        });
      }

      const stream = await chatRef.current.sendMessageStream({ message: text });
      let fullResponse = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => prev.map((msg, index) => 
          index === prev.length - 1 ? { ...msg, content: fullResponse } : msg
        ));
      }

      const { mainContent, suggestions } = parseResponseWithSuggestions(fullResponse);
      let audioData: ArrayBuffer | null = null;

      if (settings.useTTS) {
        const englishPart = mainContent.split('---')[0].trim();
        if (englishPart) {
          audioData = await generateSpeech(englishPart, selectedTeacher.voice_profile);
        }
      }

      setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 ? { ...msg, content: mainContent, suggestions, audioData } : msg
      ));

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`API Error: ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, settings, selectedTeacher.voice_profile]);

  const handleRetry = useCallback(async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === Role.User);
    if (!lastUserMessage || isLoading) return;

    const newMessages = messages.filter(m => m.role !== Role.Assistant || m.content !== '');
    const finalMessages = newMessages.slice(0, newMessages.lastIndexOf(lastUserMessage) + 1);

    setMessages(finalMessages);
    await handleSendMessage(lastUserMessage.content);
  }, [messages, isLoading, handleSendMessage]);
  
  const handleSettingsChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
      setMessages([]);
      chatRef.current = null;
  };

  return (
    <div className="flex h-screen w-full font-sans antialiased">
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/30 z-30 transition-opacity duration-300 lg:hidden ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsPanelOpen(false)}
      ></div>

      {/* Settings Panel */}
      <aside className={`fixed top-0 left-0 h-full bg-slate-100 border-r border-slate-200 transition-transform duration-300 ease-in-out z-40 w-full max-w-sm lg:relative lg:w-96 lg:translate-x-0 lg:flex-shrink-0 ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <LogoIcon className="w-8 h-8 text-sky-500" />
                    <h1 className="text-xl font-bold text-slate-800">DSU AI Teachers</h1>
                </div>
                 <button onClick={() => setIsPanelOpen(false)} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 lg:hidden">
                    <XIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="overflow-y-auto flex-grow pr-2 -mr-4 pl-1 -ml-1 scrollbar-thin">
                <TeacherSelector
                    selectedTeacherId={settings.teacherId}
                    onSelectTeacher={(id) => handleSettingsChange('teacherId', id)}
                />
                <SettingsPanel
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                    onClear={handleClear}
                />
            </div>
         </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen min-w-0">
        <header className="flex items-center p-3 sm:p-4 border-b border-slate-200 bg-white/80 backdrop-blur-lg z-10 flex-shrink-0">
            <button onClick={() => setIsPanelOpen(true)} className="mr-3 p-1.5 rounded-full text-slate-500 hover:bg-slate-200 lg:hidden">
                <MenuIcon className="h-6 w-6" />
            </button>
            <img src={`https://picsum.photos/seed/${selectedTeacher.id}/40/40`} alt={selectedTeacher.name} className="w-10 h-10 rounded-full mr-4"/>
            <div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedTeacher.name}</h2>
                <p className="text-sm text-sky-500 font-medium">{SCENARIOS.find(s => s.id === settings.scenarioId)?.name}</p>
            </div>
        </header>
        
        <ChatWindow 
          messages={messages} 
          teacher={selectedTeacher}
          isLoading={isLoading}
          onRetry={handleRetry}
          onSendMessage={handleSendMessage}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          error={error}
        />
      </main>
    </div>
  );
};

export default App;