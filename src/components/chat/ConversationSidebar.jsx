import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import moment from 'moment';

export default function ConversationSidebar({ conversations, activeId, onSelect, onCreate, onDelete }) {
  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onCreate}
          className="w-full gap-2 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                activeId === conv.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
              )}
              onClick={() => onSelect(conv.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{conv.title || 'New conversation'}</p>
                <p className="text-xs opacity-50 truncate">{moment(conv.created_date).fromNow()}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}

          {conversations.length === 0 && (
            <div className="text-center py-8 text-sidebar-foreground/40">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No conversations yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
