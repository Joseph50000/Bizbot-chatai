import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 bg-card border border-border rounded-2xl p-2 shadow-lg shadow-black/5 transition-shadow focus-within:shadow-xl focus-within:shadow-primary/5 focus-within:border-primary/30">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about our business..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 max-h-32 min-h-[40px]"
          style={{ height: 'auto', overflow: 'hidden' }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!text.trim() || disabled}
          className="h-10 w-10 rounded-xl flex-shrink-0 transition-all"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
        AI assistant powered by your company knowledge base — By Benoît HOUNYOVI
      </p>
    </form>
  );
}
