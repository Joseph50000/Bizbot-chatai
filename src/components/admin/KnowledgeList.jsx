import { Edit, Trash2, BookOpen, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import moment from 'moment';

const categoryColors = {
  FAQ: 'bg-blue-100 text-blue-700 border-blue-200',
  Procedure: 'bg-purple-100 text-purple-700 border-purple-200',
  Policy: 'bg-amber-100 text-amber-700 border-amber-200',
  Product: 'bg-green-100 text-green-700 border-green-200',
  General: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function KnowledgeList({ entries, onEdit, onDelete, onToggle }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">No knowledge entries yet</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Add your first entry to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "group bg-card border border-border rounded-xl p-4 transition-all hover:shadow-md hover:shadow-black/5",
            !entry.is_active && "opacity-50"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-medium text-sm truncate">{entry.title}</h3>
                <Badge variant="outline" className={cn("text-[10px] px-2 py-0 border", categoryColors[entry.category])}>
                  {entry.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{entry.content}</p>
              <p className="text-[10px] text-muted-foreground/50 mt-2">{moment(entry.created_date).format('MMM D, YYYY')}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggle(entry)}>
                {entry.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(entry)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => onDelete(entry.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
