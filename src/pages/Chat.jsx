import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatInput from '../components/chat/ChatInput';
import EmptyChat from '../components/chat/EmptyChat';
import ConversationSidebar from '../components/chat/ConversationSidebar';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const loadConversations = async () => {
    const convs = await base44.entities.Conversation.list('-created_date', 50);
    setConversations(convs);
  };

  const loadMessages = async (convId) => {
    setLoadingMessages(true);
    const msgs = await base44.entities.Message.filter({ conversation_id: convId }, 'created_date', 200);
    setMessages(msgs);
    setLoadingMessages(false);
  };

  const createNewConversation = async () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const deleteConversation = async (convId) => {
    // Delete messages first
    const msgs = await base44.entities.Message.filter({ conversation_id: convId }, 'created_date', 200);
    for (const msg of msgs) {
      await base44.entities.Message.delete(msg.id);
    }
    await base44.entities.Conversation.delete(convId);
    if (activeConvId === convId) {
      setActiveConvId(null);
      setMessages([]);
    }
    loadConversations();
  };

  const sendMessage = async (text) => {
    let convId = activeConvId;

    // Create conversation if needed
    if (!convId) {
      const conv = await base44.entities.Conversation.create({
        title: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
        message_count: 0,
      });
      convId = conv.id;
      setActiveConvId(convId);
      loadConversations();
    }

    // Save user message
    const userMsg = await base44.entities.Message.create({
      conversation_id: convId,
      role: 'user',
      content: text,
    });
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Get knowledge base context
    const knowledge = await base44.entities.KnowledgeBase.filter({ is_active: true }, '-created_date', 50);
    const knowledgeContext = knowledge.map((k) => `[${k.category}] ${k.title}:\n${k.content}`).join('\n\n---\n\n');

    // Build prompt
    const recentMessages = [...messages.slice(-8), userMsg]
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const systemPrompt = `You are a professional business assistant for our company. You are multilingual and fluent in both English and French.

IMPORTANT RULES:
1. ALWAYS detect the language of the user's message and respond in the SAME language (French if they write in French, English if they write in English).
2. ALWAYS prioritize information from the company knowledge base provided below.
3. If the answer is found in the knowledge base, use it directly and cite the relevant section.
4. If the knowledge base doesn't contain the answer, clearly state that and provide a helpful general response.
5. Be clear, professional, and concise in your responses.
6. Use structured formatting (bullet points, numbered lists) when appropriate.
7. Never make up company-specific information that isn't in the knowledge base.

COMPANY KNOWLEDGE BASE:
${knowledgeContext || 'No knowledge entries have been added yet. Respond helpfully but note that the knowledge base is empty.'}

CONVERSATION HISTORY:
${recentMessages}

Respond to the user's latest message helpfully and professionally, in the same language they used.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: systemPrompt,
    });

    // Save assistant message
    const assistantMsg = await base44.entities.Message.create({
      conversation_id: convId,
      role: 'assistant',
      content: response,
    });

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);

    // Update conversation
    await base44.entities.Conversation.update(convId, {
      last_message: response.slice(0, 100),
      message_count: messages.length + 2,
    });
    loadConversations();
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border flex-shrink-0 hidden md:block`}>
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={setActiveConvId}
          onCreate={createNewConversation}
          onDelete={deleteConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-12 border-b border-border flex items-center px-4 gap-2 flex-shrink-0 bg-card/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden md:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </Button>
          <div className="flex-1">
            <p className="text-xs font-medium">
              {activeConvId ? conversations.find(c => c.id === activeConvId)?.title || 'Chat' : 'New Conversation'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          {messages.length === 0 && !loadingMessages ? (
            <EmptyChat onSuggestionClick={sendMessage} />
          ) : (
            <div className="py-6 space-y-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 pb-6 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={sendMessage} disabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
}
