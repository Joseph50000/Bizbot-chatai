import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';

const categories = ['FAQ', 'Procedure', 'Policy', 'Product', 'General'];

export default function KnowledgeForm({ entry, onSave, onCancel }) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [category, setCategory] = useState(entry?.category || 'General');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    await onSave({ title: title.trim(), content: content.trim(), category, is_active: true });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Return Policy"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the knowledge content here..."
          rows={8}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl gap-2">
            <X className="w-4 h-4" /> Cancel
          </Button>
        )}
        <Button type="submit" disabled={!title.trim() || !content.trim() || saving} className="rounded-xl gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : (entry ? 'Update' : 'Add Knowledge')}
        </Button>
      </div>
    </form>
  );
}
