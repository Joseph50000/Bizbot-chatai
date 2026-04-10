import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageSquare, ChevronRight, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import moment from 'moment';

export default function ConversationViewer({ conversations }) {
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const viewConversation = async (conv) => {
    setSelectedConv(conv);
    setLoading(true);
    const msgs = await base44.entities.Message.filter(
      { conversation_id: conv.id },
      'created_date',
      200
    );
    setMessages(msgs);
    setLoading(false);
  };

  if (selectedConv) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-2 text-xs"
          onClick={() => { setSelectedConv(null); setMessages([]); }}
        >
          ← Back to conversations
        </Button>
        <h3 className="font-medium text-sm mb-4">{selectedConv.title}</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-accent"
                )}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-primary" />}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-xl px-3 py-2 text-xs",
                  msg.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card border border-border rounded-tl-sm"
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={cn(
                    "text-[9px] mt-1",
                    msg.role === 'user' ? "text-primary-foreground/60" : "text-muted-foreground/50"
                  )}>
                    {moment(msg.created_date).format('MMM D, h:mm A')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-16">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => viewConversation(conv)}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-primary/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{conv.title}</p>
            <p className="text-xs text-muted-foreground truncate">{conv.last_message || 'No messages'}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-muted-foreground">{moment(conv.created_date).fromNow()}</p>
            <p className="text-[10px] text-muted-foreground/50">{conv.message_count || 0} msgs</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
        </button>
      ))}
    </div>
  );
}
