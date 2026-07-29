'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/layout/Footer';
import {
  MessageCircle, Send, Phone, Mail, MapPin,
  ChevronDown, ChevronUp, Bot, User, Paperclip, Clock
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const faqItems = [
  {
    question: 'How long does a custom order take?',
    answer: 'Custom orders typically take 7–21 days depending on the complexity of embroidery and the tailor\'s availability. You can see the estimated delivery time on the tailor\'s profile page.',
  },
  {
    question: 'Can I modify my order after placing it?',
    answer: 'Modifications are possible within 24 hours of placing the order before tailoring begins. Contact our support team immediately via chat or call us at +91-11-4567-8901.',
  },
  {
    question: 'What if the garment doesn\'t fit?',
    answer: 'We offer a free alteration service within 14 days of delivery. Simply raise a return/alteration request from your Orders page and our team will arrange a pickup.',
  },
  {
    question: 'How do I take accurate measurements?',
    answer: 'Visit our Measurements Guide page for step-by-step instructions with illustrations and video tutorials. You can also save your measurements in your profile for future orders.',
  },
  {
    question: 'What fabrics do you use for custom orders?',
    answer: 'We use premium fabrics including Pure Silk, Brocade, Velvet, Cotton-Silk Blend, Georgette, and Premium Linen. Each fabric option is described in the Customization Studio.',
  },
  {
    question: 'Is cash on delivery available?',
    answer: 'Yes, Cash on Delivery is available for orders up to ₹25,000 in select cities. Orders above ₹25,000 require prepayment. Custom orders require a 50% advance payment.',
  },
  {
    question: 'How do I track my order?',
    answer: 'You can track your order in real-time from the Orders page. A tracking ID will be shared via email and SMS once your order is dispatched.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 40 countries. International shipping takes 7–14 business days. Customs duties and taxes are the buyer\'s responsibility.',
  },
];

const botResponses: Record<string, string> = {
  default: 'Thank you for reaching out to Hall of Fashion support. How can I help you today?',
  order: 'I can help you with your order! Please share your order number (e.g., HOF-2025-042) and I\'ll look into it right away.',
  track: 'To track your order, please visit the Orders page or share your order number. You can also find the tracking ID in your order confirmation email.',
  return: 'To initiate a return or alteration, please go to your Orders page, select the order, and click "Request Return/Alteration". Our team will get back to you within 24 hours.',
  measurement: 'For measurement guidance, visit our Measurements page. We have video tutorials and a detailed size guide. You can also save multiple measurement profiles.',
  custom: 'Our Customization Studio lets you design your own outfit from scratch! You can choose the fabric, colour, collar, sleeves, embellishments and more. It\'s a 12-step guided process.',
  size: 'Our standard sizes range from XS to XXL. For custom sizing, use our Customization Studio and provide your exact measurements.',
  payment: 'We accept all major payment methods: Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (for orders up to ₹25,000). Custom orders require a 50% advance.',
  cancel: 'Orders can be cancelled within 2 hours of placement if tailoring hasn\'t started. Please go to your Orders page or contact us immediately.',
};

function getbotReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('order') || lower.includes('placed')) return botResponses.order;
  if (lower.includes('track') || lower.includes('shipping') || lower.includes('delivery')) return botResponses.track;
  if (lower.includes('return') || lower.includes('alter') || lower.includes('fit')) return botResponses.return;
  if (lower.includes('measure')) return botResponses.measurement;
  if (lower.includes('custom') || lower.includes('design') || lower.includes('studio')) return botResponses.custom;
  if (lower.includes('size') || lower.includes('chart')) return botResponses.size;
  if (lower.includes('pay') || lower.includes('upi') || lower.includes('cod')) return botResponses.payment;
  if (lower.includes('cancel')) return botResponses.cancel;
  return 'I understand your query. Let me connect you with our support team. You can also call us at +91-11-4567-8901 or email support@halloffashion.com. Our team typically responds within 2 hours.';
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'contact'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Welcome to Hall of Fashion Support! 👋 I\'m your AI assistant. How can I help you today? You can ask about orders, tracking, measurements, customization, returns, or payments.',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: getbotReply(inputText),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const quickReplies = ['Track my order', 'Return/Alteration', 'Custom order help', 'Measurements guide'];

  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-28 pb-12 bg-luxury-black text-luxury-ivory">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="text-accent" size={24} />
              <span className="text-accent font-cormorant text-lg tracking-widest uppercase">We're Here to Help</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
              Customer <span className="text-accent">Support</span>
            </h1>
            <p className="text-luxury-beige/70 text-base">
              Chat with our AI assistant, browse FAQs, or reach our team directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border bg-card sticky top-20 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          {([['chat', 'Live Chat'], ['faq', 'FAQs'], ['contact', 'Contact Us']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="max-w-2xl mx-auto">
              {/* Status Bar */}
              <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3 mb-4 shadow-sm">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Bot className="text-luxury-black" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Hall of Fashion Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-muted-foreground">Online · Typically replies in seconds</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={12} /> 24/7
                </div>
              </div>

              {/* Messages */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="h-96 overflow-y-auto p-5 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === 'bot' ? 'bg-accent' : 'bg-luxury-black'
                      }`}>
                        {msg.sender === 'bot'
                          ? <Bot size={14} className="text-luxury-black" />
                          : <User size={14} className="text-white" />
                        }
                      </div>
                      <div className={`max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.sender === 'bot'
                            ? 'bg-muted/40 text-foreground rounded-tl-sm'
                            : 'bg-luxury-black text-luxury-ivory rounded-tr-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 px-1">{msg.time}</span>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <Bot size={14} className="text-luxury-black" />
                      </div>
                      <div className="bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1.5 items-center h-5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                              className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-5 py-3 border-t border-border flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => { setInputText(reply); }}
                      className="text-xs border border-border px-3 py-1.5 rounded-full hover:border-accent hover:text-accent transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="px-5 pb-5 pt-2">
                  <div className="flex items-center gap-3 bg-muted/20 border border-border rounded-xl px-4 py-2">
                    <button className="text-muted-foreground hover:text-accent transition-colors">
                      <Paperclip size={18} />
                    </button>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputText.trim()}
                      className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center hover:bg-luxury-black hover:text-luxury-ivory transition-all disabled:opacity-40"
                    >
                      <Send size={16} className="text-luxury-black" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="font-playfair text-2xl font-bold mb-8">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqItems.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
                    >
                      <span className="font-semibold text-sm pr-4">{faq.question}</span>
                      {expandedFaq === idx ? <ChevronUp size={18} className="text-accent shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
                    </button>
                    <AnimatePresence>
                      {expandedFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="font-playfair text-2xl font-bold mb-8">Get in Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: Phone, title: 'Call Us', detail: '+91-11-4567-8901', sub: 'Mon–Sat, 10AM–7PM IST', href: 'tel:+911145678901' },
                  { icon: Mail, title: 'Email Us', detail: 'support@halloffashion.com', sub: 'Replies within 4 hours', href: 'mailto:support@halloffashion.com' },
                  { icon: MapPin, title: 'Visit Us', detail: '14, Fashion Street, MG Road', sub: 'Bengaluru 560001', href: '#' },
                ].map(({ icon: Icon, title, detail, sub }) => (
                  <div key={title} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="text-accent" size={24} />
                    </div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-foreground font-medium">{detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h3 className="font-playfair text-xl font-bold mb-6">Send Us a Message</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Name</label>
                    <input type="text" placeholder="Your full name" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Email</label>
                    <input type="email" placeholder="your@email.com" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Phone</label>
                    <input type="tel" placeholder="+91 9876 543210" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Order Number (Optional)</label>
                    <input type="text" placeholder="HOF-2025-XXX" className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-semibold mb-1 block">Subject</label>
                  <select className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-background">
                    <option>Order Inquiry</option>
                    <option>Custom Order Help</option>
                    <option>Return/Alteration</option>
                    <option>Payment Issue</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-1 block">Message</label>
                  <textarea rows={5} placeholder="Describe your issue or query in detail..." className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none" />
                </div>
                <button
                  onClick={() => alert('Message sent! We\'ll get back to you within 4 hours.')}
                  className="w-full py-3.5 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
