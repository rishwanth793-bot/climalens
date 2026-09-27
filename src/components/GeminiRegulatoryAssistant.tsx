import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Globe2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  X,
  Bot,
  User,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { useVerification } from '../context/VerificationContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  groundingSources?: { title: string; url: string }[];
  searchQueries?: string[];
  timestamp: string;
}

export const GeminiRegulatoryAssistant: React.FC = () => {
  const { chatOpen, setChatOpen, facilityProfile, showToast, metrics, settings } = useVerification();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `Hello! I am **ClimateLens AI**, your Environmental Intelligence & Verification Assistant, with real-time Google Search Grounding.\n\nI assist Lead Verifier **${settings?.reviewerName || 'RISHWANTH'}** and your assurance team to:\n• Verify statutory emission benchmarks (CPCB norms, GHG Protocol Scope 1 & 2 standards)\n• Investigate historical variances in cement calcination & clinker factors\n• Cross-reference ambient regional air & water basin monitoring standards\n• Clarify market-based vs location-based Scope 2 dual-reporting accounting\n\nHow can I assist your environmental verification review today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [messages, chatOpen]);

  // Allow closing via Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatOpen) {
        setChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatOpen, setChatOpen]);

  const quickPrompts = [
    'What are the CPCB PM stack emission standards for rotary cement kilns in India?',
    'Explain typical Scope 1 emission intensity per ton of clinker and petcoke replacement',
    'How should we verify market-based Scope 2 emissions reduction under GHG Protocol?',
    'Is a 17.9% YoY emission reduction consistent with 14% alternative fuel substitution?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt.trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Exclude initial greeting and send sanitized conversation history
      const conversationTurns = newMessages
        .filter((m) => m.id !== 'init-1')
        .map((m) => ({ role: m.role, content: m.content }));

      const metricsSummary = metrics
        .slice(0, 15)
        .map((m) => `${m.metricName}: ${m.value} ${m.unit} (${m.verificationStatus})`)
        .join('; ');

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationTurns,
          query,
          metricsSummary,
        }),
      });

      const data = await response.json();

      const aiReplyMessage: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        content: data.reply || (data.error ? `Verification Notice: ${data.error}` : 'Environmental verification guidance is available for review.'),
        groundingSources: data.groundingSources,
        searchQueries: data.searchQueries,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReplyMessage]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `Unable to connect to Gemini verification service: ${errorMsg}. Please ensure dev server is active.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        role: 'model',
        content: `Conversation reset. Ask any question about environmental compliance, CPCB guidelines, or GHG Protocol verification.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    showToast('Conversation history reset.');
  };

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-500 to-teal-700 text-white p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/40"
        title="Open ClimateLens AI Assistant"
      >
        <Sparkles className="w-5 h-5 text-white" />
        <span className="text-xs font-bold pr-1 font-industrial text-white">ClimateLens AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[440px] max-w-[440px] h-[min(580px,calc(100dvh-1.5rem))] max-h-[calc(100dvh-1.5rem)] bg-[#0D121F] rounded-2xl shadow-2xl border border-[#1E293B] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Top Header */}
      <div className="sticky top-0 z-30 shrink-0 bg-[#0B0F17] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between shadow-xs border-b border-[#1E293B]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs flex items-center gap-1.5 truncate">
              <span className="truncate text-slate-100">ClimateLens AI</span>
              <span className="text-[9px] font-mono bg-sky-500/10 text-sky-300 px-1.5 py-0.2 rounded border border-sky-500/20 shrink-0">
                Grounded
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Environmental Auditor Advisor
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <button
            onClick={handleResetChat}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#0D121F] transition-colors cursor-pointer"
            title="Reset Chat History"
            aria-label="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D121F] hover:bg-[#1E293B] text-slate-300 hover:text-white font-medium text-xs transition-all cursor-pointer border border-[#1E293B]"
            title="Close Assistant Window (Esc)"
            aria-label="Close Assistant Window"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Facility Context Strip */}
      <div className="bg-[#0B0F17]/80 border-b border-[#1E293B] px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Audited: {facilityProfile.facilityName}</span>
        <span className="text-emerald-400 font-semibold">{facilityProfile.reportingPeriod}</span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0B0F17] text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
              {msg.role === 'user' ? (
                <>
                  <span>Verifier</span>
                  <User className="w-3 h-3 text-slate-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">ClimateLens AI</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-500/20 text-emerald-100 rounded-br-xs border border-emerald-500/30'
                  : 'bg-[#0D121F] text-slate-200 rounded-bl-xs border border-[#1E293B] shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Grounding Sources Badge */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#1E293B] space-y-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-sky-400 uppercase font-mono">
                    <Globe2 className="w-3 h-3 text-sky-400" /> Grounded Regulatory Sources
                  </div>
                  <div className="space-y-1">
                    {msg.groundingSources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between text-[11px] text-sky-300 hover:text-sky-200 bg-sky-950/40 px-2 py-1 rounded border border-sky-800/40 transition-colors"
                      >
                        <span className="truncate pr-2">{source.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Search queries used */}
              {msg.searchQueries && msg.searchQueries.length > 0 && (
                <div className="mt-2 text-[10px] text-slate-400 flex flex-wrap items-center gap-1">
                  <span className="font-semibold text-slate-300">Search Queries:</span>
                  {msg.searchQueries.map((q, idx) => (
                    <span
                      key={idx}
                      className="bg-[#0B0F17] text-slate-300 px-1.5 py-0.5 rounded font-mono text-[9px] border border-[#1E293B]"
                    >
                      "{q}"
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-[#0D121F] rounded-xl border border-[#1E293B] text-slate-400 text-xs w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Consulting environmental standards &amp; searching CPCB / GHG Protocol guidance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-[#0D121F] border-t border-[#1E293B] px-3 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold shrink-0">
          Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#0D121F] hover:bg-[#1E293B] text-slate-300 transition-colors cursor-pointer shrink-0 border border-[#1E293B]"
          >
            {qp.length > 35 ? qp.substring(0, 35) + '...' : qp}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-[#0D121F] border-t border-[#1E293B]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about emissions, CPCB standards, water balances..."
            className="flex-1 px-3 py-2 rounded-xl bg-[#0D121F] border border-[#1E293B] text-xs text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 font-medium"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer font-bold"
            title="Send Message"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
          <span>Press Enter to send</span>
          <button
            type="button"
            onClick={() => setChatOpen(false)}
            className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
