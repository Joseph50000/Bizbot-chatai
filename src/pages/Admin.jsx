import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, BookOpen, MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KnowledgeForm from '../components/admin/KnowledgeForm';
import KnowledgeList from '../components/admin/KnowledgeList';
import ConversationViewer from '../components/admin/ConversationViewer';

export default function Admin() {
  const [entries, setEntries] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [kb, convs] = await Promise.all([
      base44.entities.KnowledgeBase.list('-created_date', 100),
      base44.entities.Conversation.list('-created_date', 50),
    ]);
    setEntries(kb || []);
    setConversations(convs || []);
    setLoading(false);
  };

  const handleSave = async (data) => {
    if (editingEntry) {
      await base44.entities.KnowledgeBase.update(editingEntry.id, data);
    } else {
      await base44.entities.KnowledgeBase.create(data);
    }
    setDialogOpen(false);
    setEditingEntry(null);
    loadData();
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    await base44.entities.KnowledgeBase.delete(id);
    loadData();
  };

  const handleToggle = async (entry) => {
    await base44.entities.KnowledgeBase.update(entry.id, { is_active: !entry.is_active });
    loadData();
  };

  const filteredEntries = entries.filter((e) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="knowledge" className="flex-1 flex flex-col">
        <div className="border-b border-border px-4 pt-4 pb-0 bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage your knowledge base and view conversations</p>
            </div>
          </div>
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="knowledge" className="gap-2 rounded-lg text-xs data-[state=active]:shadow-sm">
              <BookOpen className="w-3.5 h-3.5" /> Knowledge Base ({entries.length})
            </TabsTrigger>
            <TabsTrigger value="conversations" className="gap-2 rounded-lg text-xs data-[state=active]:shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" /> Conversations ({conversations.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="knowledge" className="flex-1 overflow-hidden mt-0">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge base..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <Button
              onClick={() => { setEditingEntry(null); setDialogOpen(true); }}
              className="gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" /> Add Entry
            </Button>
          </div>
          <ScrollArea className="flex-1 h-[calc(100vh-240px)]">
            <div className="p-4">
              <KnowledgeList
                entries={filteredEntries}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="conversations" className="flex-1 overflow-hidden mt-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4">
              <ConversationViewer conversations={conversations} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}</DialogTitle>
          </DialogHeader>
          <KnowledgeForm
            entry={editingEntry}
            onSave={handleSave}
            onCancel={() => { setDialogOpen(false); setEditingEntry(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
