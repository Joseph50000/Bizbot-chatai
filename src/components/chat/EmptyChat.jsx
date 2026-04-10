import { Bot, Sparkles, BookOpen, HelpCircle } from 'lucide-react';

const suggestions = [
  { icon: HelpCircle, text: "What services do you offer?" },
  { icon: BookOpen, text: "Tell me about your policies" },
  { icon: Sparkles, text: "Quels sont vos services ?" },
  { icon: HelpCircle, text: "Quelle est votre politique de retour ?" },
];

export default function EmptyChat({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Bot className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Business Assistant</h2>
      <p className="text-muted-foreground text-sm text-center max-w-md mb-8">
        I'm your AI-powered assistant with access to our company knowledge base. Ask me anything — in English or French.<br/>
        <span className="text-xs opacity-70">Posez vos questions en anglais ou en français.</span>
      </p>

      <div className="grid gap-3 w-full max-w-md">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent text-left transition-colors group"
          >
            <s.icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
            <span className="text-sm text-foreground/80 group-hover:text-foreground">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
