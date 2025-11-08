import React, { useEffect, useRef, useState } from 'react';
import { Message, Role, Teacher } from '../types';
import { createAudioBlob } from '../services/openaiService';
import { UserIcon, VolumeIcon, LoadingIcon, DownloadIcon, RefreshIcon, SparklesIcon } from './icons';

interface ChatWindowProps {
  messages: Message[];
  teacher: Teacher;
  isLoading: boolean;
  onRetry: () => void;
  onSendMessage: (text: string) => void;
}

const AudioPlayer: React.FC<{ audioData: ArrayBuffer }> = ({ audioData }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioData.byteLength > 0) {
            playAudio();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioData]);

    const playAudio = async () => {
        if (isPlaying) return;

        try {
            setIsPlaying(true);
            const blob = createAudioBlob(audioData);
            const url = URL.createObjectURL(blob);

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();
        } catch (error) {
            console.error("Failed to play audio:", error);
            setIsPlaying(false);
        }
    };

    return (
        <button
          onClick={playAudio}
          disabled={isPlaying}
          aria-label="Play audio"
          className="p-2 rounded-full bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 disabled:bg-slate-500/10 disabled:text-slate-400 transition-colors"
        >
          <VolumeIcon className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
        </button>
    )
}

const MessageBubble: React.FC<{ message: Message; teacher: Teacher; isLastMessage: boolean; isLoading: boolean; onRetry: () => void; onSendMessage: (text: string) => void; }> = ({ message, teacher, isLastMessage, isLoading, onRetry, onSendMessage }) => {
  const isUser = message.role === Role.User;
  const [english, thai] = isUser ? [message.content, null] : message.content.split('---');

  const handleDownload = () => {
    if (!message.audioData) return;
    const blob = createAudioBlob(message.audioData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsu-ai-teacher-${new Date().toISOString()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-3 my-2">
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-2xl rounded-br-lg p-3.5 max-w-lg shadow-md">
          <p>{message.content}</p>
        </div>
         <div className="w-10 h-10 p-2 bg-slate-200 rounded-full flex-shrink-0">
            <UserIcon className="text-slate-500" />
         </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 my-2">
      <img src={`https://picsum.photos/seed/${teacher.id}/40/40`} alt={teacher.name} className="w-10 h-10 rounded-full flex-shrink-0"/>
      <div className="bg-white rounded-2xl rounded-bl-lg p-3.5 max-w-lg w-full shadow-sm">
        {english.trim() === '' && !thai && isLoading && <LoadingIcon className="w-5 h-5 animate-spin text-slate-500" />}
        <p className="text-slate-800 whitespace-pre-wrap">{english}</p>
        {thai && <p className="text-slate-500 mt-3 pt-3 border-t border-slate-200 text-sm whitespace-pre-wrap">{thai}</p>}
        
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <h4 className="text-xs font-semibold text-sky-600 mb-2 flex items-center gap-1.5"><SparklesIcon className="w-4 h-4" /> Suggested Replies</h4>
            <div className="flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(suggestion)}
                  disabled={isLoading}
                  className="px-3 py-1 text-xs sm:text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {(message.audioData || (isLastMessage && !isLoading)) && (
             <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {message.audioData && (
                        <>
                            <AudioPlayer audioData={message.audioData}/>
                            <button 
                                onClick={handleDownload}
                                aria-label="Download audio"
                                className="p-2 rounded-full text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <DownloadIcon className="w-5 h-5"/>
                            </button>
                        </>
                    )}
                </div>
                 {isLastMessage && !isLoading && (
                    <button 
                        onClick={onRetry}
                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
                    >
                        <RefreshIcon className="w-4 h-4" />
                        Retry
                    </button>
                )}
             </div>
        )}
      </div>
    </div>
  );
};


const ChatWindow: React.FC<ChatWindowProps> = ({ messages, teacher, isLoading, onRetry, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 scrollbar-thin">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <img src={`https://picsum.photos/seed/${teacher.id}/100/100`} alt={teacher.name} className="w-24 h-24 rounded-full mb-4 opacity-60"/>
            <p className="text-lg font-medium">Conversation with {teacher.name}</p>
            <p className="max-w-xs">Select your preferences in the side panel and send a message to begin your conversation practice.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full">
            {messages.map((msg, index) => (
              <MessageBubble 
                key={index} 
                message={msg} 
                teacher={teacher} 
                isLastMessage={index === messages.length - 1 && msg.role === Role.Assistant}
                isLoading={isLoading}
                onRetry={onRetry}
                onSendMessage={onSendMessage}
              />
            ))}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;