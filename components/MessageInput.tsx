
import React, { useState } from 'react';
import { SendIcon, AlertTriangleIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  error: string | null;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, error }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200">
       <div className="max-w-4xl mx-auto">
        {error && (
            <div className="flex items-center bg-rose-500/10 text-rose-600 text-sm p-2.5 rounded-lg mb-3">
                <AlertTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
                <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                    }
                }}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-slate-100 p-3 pr-12 rounded-lg text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none transition-all scrollbar-thin"
                disabled={isLoading}
                style={{ maxHeight: '120px' }}
                />
                 <button type="submit" disabled={isLoading || !text.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 text-white rounded-md p-2 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </form>
       </div>
    </div>
  );
};

export default MessageInput;