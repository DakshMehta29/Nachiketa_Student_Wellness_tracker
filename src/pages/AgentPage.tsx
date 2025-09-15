import { useEffect, useState, useRef, useCallback } from 'react';
import Header from '../components/Header';
import { Send, Bot, User, Copy, Trash2, MessageSquare, Sparkles, Heart, Brain, Zap, Settings, Database, ChevronDown, Users, GraduationCap, Dumbbell, Route, Check } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { chatService, ChatContext } from '../services/chatService';
import { ChatSession, ChatMessageDB, supabaseService } from '../services/supabaseService';
import { validateAuthConfig } from '../config/auth';

const STORAGE_KEY_PREFIX = 'nachiketa-convo-';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
};

type ConversationMeta = { 
  id: string; 
  title: string; 
  createdAt: number;
  lastMessage?: string;
  messageCount: number;
};

type CompanionMode = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

const AgentPage = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [convos, setConvos] = useState<ConversationMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [storageStatus, setStorageStatus] = useState<{ type: string; available: boolean; details: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentCompanion, setCurrentCompanion] = useState<string>('mentor');
  const [showCompanionDropdown, setShowCompanionDropdown] = useState(false);
  const [showModeChangeNotification, setShowModeChangeNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available companion modes
  const companionModes: CompanionMode[] = [
    {
      id: 'mentor',
      name: 'Mentor AI',
      description: 'Guides you with studies, career, and personal growth advice',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      id: 'buddy',
      name: 'Buddy AI',
      description: 'A friendly companion to chat casually and share thoughts with',
      icon: <Users className="w-5 h-5" />,
      color: 'from-green-500 to-teal-500',
      bgColor: 'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20'
    },
    {
      id: 'fitness_trainer',
      name: 'Fitness Trainer AI',
      description: 'Helps you track workouts, diet, and physical wellness',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    },
    {
      id: 'smart_router',
      name: 'Smart Router AI',
      description: 'Detects query intent and routes you to the right companion',
      icon: <Route className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    },
    {
      id: 'pet',
      name: 'Go Back to Pet',
      description: 'Return to pet companion selection',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-pink-500 to-purple-500',
      bgColor: 'from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20'
    }
  ];

  // Validate auth configuration on mount
  useEffect(() => {
    const errors = validateAuthConfig();
    if (errors.length > 0) {
      console.warn('Configuration issues:', errors);
    }
  }, []);

  // Load user's companion selection
  useEffect(() => {
    const loadCompanionSelection = async () => {
      if (!user) return;
      
      try {
        const selection = await supabaseService.getUserCompanionSelection(user.id);
        if (selection && selection.companion_type) {
          setCurrentCompanion(selection.companion_type);
        }
      } catch (error) {
        console.error('Error loading companion selection:', error);
      }
    };

    if (isLoaded && user) {
      loadCompanionSelection();
    }
  }, [isLoaded, user]);

  // Handle companion switching
  const handleCompanionSwitch = async (companionId: string) => {
    if (companionId === 'pet') {
      // Navigate back to companion selection page
      window.location.href = '/companion-selection';
      return;
    }
    
    const previousCompanion = currentCompanion;
    setCurrentCompanion(companionId);
    setShowCompanionDropdown(false);
    
    // Show notification if switching between different AI modes
    if (previousCompanion !== companionId && previousCompanion !== 'pet') {
      setShowModeChangeNotification(true);
      setTimeout(() => setShowModeChangeNotification(false), 3000);
    }
    
    // Save the new companion selection
    if (user) {
      try {
        await supabaseService.saveUserCompanionSelection(user.id, {
          type: 'companion',
          companion_type: companionId
        });
      } catch (error) {
        console.error('Error saving companion selection:', error);
      }
    }
  };

  // Load user conversations
  const loadUserConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      const conversations = await chatService.getUserChatSessions(user);
      const convosMeta = conversations.map((conv: ChatSession) => ({
        id: conv.id,
        title: conv.session_name || 'Untitled Conversation',
        createdAt: new Date(conv.created_at).getTime() || Date.now(),
        lastMessage: 'No messages yet',
        messageCount: 0
      }));
      
      setConvos(convosMeta);
      if (convosMeta.length > 0 && !activeId) {
        setActiveId(convosMeta[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [user, activeId]);

  // Load conversation messages
  const loadConversationMessages = useCallback(async (conversationId: string) => {
    if (!user) return;
    
    try {
      const conversation = await chatService.loadChatSession(conversationId, user);
      if (conversation) {
        setMessages(conversation.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      setMessages([]);
    }
  }, [user]);

  // Get storage status
  useEffect(() => {
    setStorageStatus(chatService.getStorageStatus());
  }, []);

  // Load conversations when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      loadUserConversations();
    }
  }, [isLoaded, user, loadUserConversations]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeId && user) {
      loadConversationMessages(activeId);
    } else {
      setMessages([]);
    }
  }, [activeId, user, loadConversationMessages]);

  // Save messages to localStorage
  useEffect(() => {
    if (activeId && messages.length > 0) {
      const storageKey = STORAGE_KEY_PREFIX + activeId;
      localStorage.setItem(storageKey, JSON.stringify(messages));
      
      // Update conversation metadata
      setConvos(prev => prev.map(conv => 
        conv.id === activeId 
          ? { 
              ...conv, 
              lastMessage: messages[messages.length - 1]?.content.substring(0, 50) + '...',
              messageCount: messages.length
            }
          : conv
      ));
    }
  }, [messages, activeId]);

  // Save conversations to localStorage
	useEffect(() => {
		localStorage.setItem('nachiketa-convos', JSON.stringify(convos));
	}, [convos]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCompanionDropdown(false);
      }
    };

    if (showCompanionDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCompanionDropdown]);

	function startNew() {
    if (!user) {
      // Redirect to sign in if not authenticated
      window.location.href = '/sign-in';
      return;
    }

		const id = `${Date.now()}`;
    const meta: ConversationMeta = { 
      id, 
      title: 'New chat', 
      createdAt: Date.now(),
      messageCount: 0
    };
		setConvos((prev) => [meta, ...prev]);
		setActiveId(id);
    setMessages([]);
    inputRef.current?.focus();
	}

	function rename(id: string, title: string) {
		setConvos((prev) => prev.map(c => c.id === id ? { ...c, title } : c));
	}

	function remove(id: string) {
		setConvos((prev) => prev.filter(c => c.id !== id));
		localStorage.removeItem(STORAGE_KEY_PREFIX + id);
    if (activeId === id) {
      const remaining = convos.filter(c => c.id !== id);
      setActiveId(remaining[0]?.id ?? null);
    }
  }

  function clearMessages() {
    if (activeId) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY_PREFIX + activeId);
    }
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content);
  }

  async function sendMessage() {
    if (!inputMessage.trim() || isLoading || !activeId || !user) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Create chat context
      const chatContext: ChatContext = {
        user: {
          id: user.id,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          primaryEmailAddress: user.primaryEmailAddress ? { emailAddress: user.primaryEmailAddress.emailAddress } : undefined,
          createdAt: user.createdAt || undefined
        },
        conversationId: activeId,
        previousMessages: messages,
        userPreferences: {
          wellnessFocus: 'general',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          companionMode: currentCompanion
        }
      };

      // Send message using chat service
      const response = await chatService.sendMessage(inputMessage.trim(), chatContext);

      if (response.success) {
        setMessages(prev => [...prev, response.message]);
        
        // Update conversation title if it's the first message
        if (newMessages.length === 1) {
          const title = inputMessage.substring(0, 30) + (inputMessage.length > 30 ? '...' : '');
          rename(activeId, title);
        }

        // Save conversation
        await saveConversation();
      } else {
        throw new Error(response.error || 'Failed to get response from AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide a fallback response when backend is not available
      const fallbackResponse = getFallbackResponse(inputMessage);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackResponse,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update conversation title if it's the first message
      if (newMessages.length === 1) {
        const title = inputMessage.substring(0, 30) + (inputMessage.length > 30 ? '...' : '');
        rename(activeId, title);
      }

      // Save conversation even with fallback response
      await saveConversation();
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }

  // Save current conversation
  async function saveConversation() {
    if (!activeId || !user || messages.length === 0) return;

    try {
      const session: ChatSession = {
        id: activeId,
        user_id: user.id,
        session_name: convos.find(c => c.id === activeId)?.title || 'New Chat',
        session_type: 'wellness',
        context_data: {
          tags: [],
          category: 'wellness',
          summary: messages.length > 0 ? messages[messages.length - 1].content.substring(0, 100) : ''
        },
        is_active: true,
        created_at: new Date(convos.find(c => c.id === activeId)?.createdAt || Date.now()).toISOString(),
        updated_at: new Date().toISOString()
      };

      const lastMessage = messages[messages.length - 1];
      const message: ChatMessageDB = {
        id: lastMessage.id,
        session_id: activeId,
        user_id: user.id,
        message_type: lastMessage.role as 'user' | 'assistant' | 'system',
        content: lastMessage.content,
        metadata: {
          userId: user.id,
          conversationId: activeId,
          context: {}
        },
        tokens_used: 0,
        response_time_ms: 0,
        sentiment_score: 0,
        topics: [],
        created_at: new Date(lastMessage.timestamp).toISOString()
      };

      await chatService.saveChatSession(session, message);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('sleep') || message.includes('tired') || message.includes('insomnia')) {
      return `I understand you're having sleep concerns. Here are some gentle suggestions:

🌙 **Sleep Hygiene Tips:**
• Try to go to bed and wake up at the same time daily
• Create a relaxing bedtime routine (reading, gentle music, meditation)
• Keep your bedroom cool, dark, and quiet
• Avoid screens 1 hour before bed
• Limit caffeine after 2 PM

💤 **Quick Relaxation:**
Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.

Remember, good sleep is essential for your mental and physical health. If sleep issues persist, consider speaking with a healthcare provider.`;
    }
    
    if (message.includes('stress') || message.includes('anxious') || message.includes('worried')) {
      return `I hear that you're feeling stressed, and that's completely valid. Here are some gentle ways to help:

🧘 **Immediate Relief:**
• Take 5 deep breaths, counting to 4 on each inhale and exhale
• Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste

💪 **Stress Management:**
• Break large tasks into smaller, manageable steps
• Practice mindfulness or meditation for just 5 minutes daily
• Regular physical activity, even a short walk, can help
• Talk to someone you trust about what's on your mind

Remember, it's okay to feel stressed sometimes. You're doing your best, and that's enough.`;
    }
    
    if (message.includes('exercise') || message.includes('workout') || message.includes('fitness')) {
      return `Great that you're thinking about physical activity! Here are some gentle suggestions:

🏃 **Easy Ways to Move:**
• Take a 10-minute walk around your neighborhood
• Try gentle stretching or yoga
• Dance to your favorite music for 5 minutes
• Take the stairs instead of elevators when possible
• Do simple bodyweight exercises like squats or push-ups

💡 **Remember:**
• Start small and gradually increase
• Find activities you enjoy - it's more sustainable
• Even 10 minutes of movement can boost your mood
• Listen to your body and rest when needed

Every bit of movement counts toward your wellness journey!`;
    }
    
    if (message.includes('eat') || message.includes('food') || message.includes('nutrition') || message.includes('meal')) {
      return `I'm glad you're thinking about nutrition! Here are some gentle, balanced suggestions:

🥗 **Simple Nutrition Tips:**
• Aim for colorful fruits and vegetables (try to "eat the rainbow")
• Include lean proteins like chicken, fish, beans, or tofu
• Choose whole grains when possible (brown rice, quinoa, whole wheat)
• Stay hydrated - aim for 6-8 glasses of water daily
• Don't skip meals - regular eating helps maintain energy

🍎 **Quick Healthy Snacks:**
• Apple slices with almond butter
• Greek yogurt with berries
• Hummus with carrot sticks
• A handful of nuts and dried fruit

Remember, healthy eating is about balance, not perfection. Small, consistent changes make a big difference!`;
    }
    
    if (message.includes('study') || message.includes('exam') || message.includes('academic') || message.includes('school')) {
      return `I understand the academic pressure you're feeling. Here are some strategies to help:

📚 **Study Tips:**
• Use the Pomodoro Technique: 25 minutes focused study, 5-minute break
• Create a dedicated study space free from distractions
• Break large topics into smaller, manageable chunks
• Use active recall techniques like flashcards or practice questions
• Get adequate sleep - your brain consolidates learning during rest

🧠 **Mental Wellness:**
• Take regular breaks to prevent burnout
• Stay connected with friends and family
• Practice self-compassion - you're doing your best
• Remember that grades don't define your worth
• Seek help from teachers or counselors if you're struggling

You've got this! Remember to be kind to yourself during this journey.`;
    }
    
    // Default empathetic response
    return `Thank you for sharing that with me. I'm here to listen and support you on your wellness journey.

💙 **General Wellness Reminders:**
• Take things one day at a time
• Practice self-compassion - you're doing your best
• Small, consistent actions lead to big changes
• It's okay to ask for help when you need it
• Celebrate your progress, no matter how small

Is there a specific area of wellness you'd like to explore together? I'm here to help with sleep, stress management, exercise, nutrition, or just to listen.`;
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Dynamic suggested prompts based on current companion mode
  const getSuggestedPrompts = (companionMode: string) => {
    switch (companionMode) {
      case 'mentor':
        return [
          "How can I improve my study habits for better grades?",
          "I'm feeling overwhelmed with my coursework, any advice?",
          "What's the best way to prepare for upcoming exams?",
          "How do I choose the right career path for me?",
          "Can you help me create an effective study schedule?",
          "What skills should I develop for my future career?",
          "How do I stay motivated during long study sessions?",
          "What's the best approach to time management as a student?"
        ];
      
      case 'buddy':
        return [
          "How was your day? I need someone to talk to",
          "I'm feeling a bit lonely, can we chat?",
          "Tell me something interesting that happened to you",
          "I had a rough day and need some encouragement",
          "What's your favorite way to relax after a long day?",
          "I'm excited about something and want to share it!",
          "Can you help me feel better about a situation?",
          "What's something that always makes you smile?"
        ];
      
      case 'fitness_trainer':
        return [
          "What's the best workout routine for beginners?",
          "How can I lose weight effectively and safely?",
          "What exercises can I do at home without equipment?",
          "Help me create a meal plan for muscle building",
          "How often should I exercise each week?",
          "What's the best way to stay motivated with fitness?",
          "Can you suggest some healthy snack options?",
          "How do I prevent injuries while working out?"
        ];
      
      case 'smart_router':
        return [
          "I'm not sure what type of help I need right now",
          "Can you help me figure out what I should focus on?",
          "I have multiple concerns, where should I start?",
          "What's the most important thing for me to work on?",
          "I feel overwhelmed, can you guide me?",
          "Help me prioritize my wellness goals",
          "I need advice but don't know which area to focus on",
          "Can you analyze my situation and suggest next steps?"
        ];
      
      default:
        return [
          "How can I improve my overall wellness?",
          "I'm feeling stressed, any tips?",
          "What are some healthy habits I can start?",
          "Help me with my sleep quality",
          "How can I build better daily routines?"
        ];
    }
  };

  const suggestedPrompts = getSuggestedPrompts(currentCompanion);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Bot className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Welcome to Nachiketa AI
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Sign in to start your personalized wellness journey with our AI companion. 
                Your conversations will be saved and personalized just for you.
              </p>
              <div className="space-y-4">
                <a
                  href="/sign-in"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  <User className="w-5 h-5" />
                  Sign In to Continue
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your conversations are private and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
			<Header />
			<div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8 h-[calc(100vh-200px)] relative">
          {/* Sidebar */}
					<aside className="col-span-12 md:col-span-3">
            <div className="rounded-3xl border border-white/20 dark:border-gray-700/50 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  Conversations
                </h2>
                <button 
                  onClick={startNew} 
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  New Chat
                </button>
							</div>
              
              <div className="flex-1 overflow-y-auto space-y-2">
								{convos.length === 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 text-center py-8">
                    <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No conversations yet
                  </div>
								)}
								{convos.map(c => (
                  <div 
                    key={c.id} 
                    className={`group rounded-2xl p-4 border transition-all duration-300 ${
                      activeId === c.id 
                        ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg transform scale-[1.02]' 
                        : 'border-white/20 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-white/40 dark:hover:border-gray-600/50 hover:shadow-md hover:transform hover:scale-[1.01]'
                    }`}
                  >
                    <button 
                      onClick={() => setActiveId(c.id)} 
                      className="text-left w-full"
                    >
                      <div className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate mb-2">
											{c.title}
                      </div>
                      {c.lastMessage && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                          {c.lastMessage}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          {c.messageCount}
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button 
                        onClick={() => rename(c.id, prompt('Rename conversation', c.title) || c.title)} 
                        className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        Rename
                      </button>
                      <button 
                        onClick={() => remove(c.id)} 
                        className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Delete
										</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</aside>

          {/* Main Chat Area */}
          <main className="col-span-12 md:col-span-9 flex flex-col relative">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    AI Wellness Companion
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                    Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.firstName || 'there'}</span>! Your empathetic AI assistant for mental health, wellness, and personal growth
                  </p>
                  {storageStatus && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {storageStatus.type === 'Supabase' ? (
                        <Database className="w-3 h-3" />
                      ) : storageStatus.type === 'Backend API' ? (
                        <Database className="w-3 h-3" />
                      ) : (
                        <Database className="w-3 h-3" />
                      )}
                      <span>{storageStatus.details}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  {activeId && messages.length > 0 && (
                    <button 
                      onClick={clearMessages}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Chat
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Companion Mode Selector */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-3 mb-4 relative z-[100]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
                    AI Mode
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    Switch companions for specialized assistance
                  </p>
                </div>
                <div className="relative ml-3" ref={dropdownRef}>
                  <button
                    onClick={() => setShowCompanionDropdown(!showCompanionDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                  >
                    {companionModes.find(mode => mode.id === currentCompanion)?.icon}
                    <span className="font-medium">
                      {companionModes.find(mode => mode.id === currentCompanion)?.name}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCompanionDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCompanionDropdown && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setShowCompanionDropdown(false)}
                      />
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl z-[9999] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        {companionModes.map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => handleCompanionSwitch(mode.id)}
                            className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-4 ${
                              currentCompanion === mode.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className={`p-2 rounded-xl bg-gradient-to-r ${mode.color} text-white shadow-lg`}>
                              {mode.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 dark:text-gray-100">
                                {mode.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {mode.description}
                              </div>
                            </div>
                            {currentCompanion === mode.id && (
                              <div className="ml-auto">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mode Change Notification */}
            {showModeChangeNotification && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Switched to {companionModes.find(mode => mode.id === currentCompanion)?.name}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300">
                      Suggested questions and responses have been updated for this mode
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Settings & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">User Information</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Name: {user.firstName} {user.lastName}</p>
                      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
                      <p>Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Storage Status</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Type: {storageStatus?.type}</p>
                      <p>Status: {storageStatus?.available ? '✅ Connected' : '❌ Not Available'}</p>
                      <p>Details: {storageStatus?.details}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Heart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      Welcome to Nachiketa! 💙
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                      I'm your {companionModes.find(mode => mode.id === currentCompanion)?.name || 'AI companion'}, ready to help you with {companionModes.find(mode => mode.id === currentCompanion)?.description.toLowerCase() || 'your wellness journey'}. Try the suggested questions below or switch between different AI modes using the selector above!
                    </p>
                    
                    <div className="max-w-4xl mx-auto" key={currentCompanion}>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
                        Suggested Questions for {companionModes.find(mode => mode.id === currentCompanion)?.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {suggestedPrompts.slice(0, 6).map((prompt, index) => (
                          <button
                            key={`${currentCompanion}-${index}`}
                            onClick={() => setInputMessage(prompt)}
                            className="p-3 text-left text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transform hover:scale-105"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 mb-6 group ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        {companionModes.find(mode => mode.id === currentCompanion)?.icon || <Bot className="w-5 h-5 text-white" />}
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] rounded-3xl px-6 py-4 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-gray-100 border border-white/20 dark:border-gray-600/50'
                      }`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                      <div className={`text-xs mt-3 ${
                        message.role === 'user' 
                          ? 'text-blue-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                        title="Copy message"
                      >
                        <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-4 justify-start mb-6 animate-fadeIn">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      {companionModes.find(mode => mode.id === currentCompanion)?.icon || <Bot className="w-5 h-5 text-white" />}
                    </div>
                    <div className="bg-white/90 dark:bg-gray-700/90 rounded-3xl px-6 py-4 shadow-lg border border-white/20 dark:border-gray-600/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-white/20 dark:border-gray-700/50 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="flex gap-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about wellness, mental health, or life..."
                    className="flex-1 px-6 py-4 border border-white/30 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      {companionModes.find(mode => mode.id === currentCompanion)?.icon || <Brain className="w-3 h-3" />}
                      {companionModes.find(mode => mode.id === currentCompanion)?.name || 'Wellness AI'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Always Learning
                    </span>
                  </div>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default AgentPage;


