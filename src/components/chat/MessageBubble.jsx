import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import moment from 'moment';
import { cn } from '@/lib/utils';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex gap-3 max-w-3xl mx-auto", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
        isUser ? "bg-primary text-primary-foreground" : "bg-accent border border-border"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
      </div>

      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start", "max-w-[80%]")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-card border border-border text-card-foreground rounded-tl-sm"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              className="prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              components={{
                p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                code: ({ children, inline }) => inline ? (
                  <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">{children}</code>
                ) : (
                  <pre className="bg-muted rounded-lg p-3 my-2 overflow-x-auto">
                    <code className="text-xs font-mono">{children}</code>
                  </pre>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground px-2">
          {moment(message.created_date).format('h:mm A')}
        </span>
      </div>
    </div>
  );
}
