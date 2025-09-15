import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from '../components/Header';
import LazyImage from '../components/LazyImage';
import { BuddyUser, ChatMessage } from '../types';
import { getBuddyById } from '../data/buddyData';
import { 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';

const ChatPage: React.FC = () => {
  const { buddyId } = useParams<{ buddyId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [buddy, setBuddy] = useState<BuddyUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (buddyId) {
      const buddyData = getBuddyById(buddyId);
      if (buddyData) {
        setBuddy(buddyData);
        // Initialize with some sample messages
        setMessages([
          {
            id: '1',
            senderId: buddyId,
            receiverId: user?.id || '',
            content: `Hey! Thanks for connecting with me. I'm excited to chat about ${buddyData.activityTag.toLowerCase()}!`,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            type: 'text'
          },
          {
            id: '2',
            senderId: user?.id || '',
            receiverId: buddyId,
            content: `Hi ${buddyData.name}! I'm really interested in learning more about your fitness journey. What's your favorite part about ${buddyData.activityTag.toLowerCase()}?`,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            type: 'text'
          },
          {
            id: '3',
            senderId: buddyId,
            receiverId: user?.id || '',
            content: `That's awesome! I love how ${buddyData.activityTag.toLowerCase()} helps me stay motivated and healthy. What about you? What got you interested in wellness?`,
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            type: 'text'
          }
        ]);
      } else {
        navigate('/buddy-matcher');
      }
    }
  }, [buddyId, user?.id, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !buddy) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: buddy.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate buddy typing and responding
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "That's really interesting! Tell me more about that.",
        "I totally agree with you on that point!",
        "That sounds amazing! I'd love to try that sometime.",
        "Thanks for sharing that with me!",
        "That's a great perspective on things.",
        "I'm really enjoying our conversation!",
        "That's exactly what I was thinking too!",
        "Wow, that's really insightful!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const buddyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: buddy.id,
        receiverId: user.id,
        content: randomResponse,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, buddyMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!buddy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Chat Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/buddy-matcher')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="relative">
                <LazyImage
                  src={buddy.profilePicture}
                  alt={buddy.name}
                  className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-lg"
                  fallbackSrc={`https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.name}&backgroundColor=b6e3f4&size=150`}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {buddy.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {buddy.lastActive}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl h-96 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === user?.id;
              const showDate = index === 0 || 
                formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center mb-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isOwnMessage && (
                        <LazyImage
                          src={buddy.profilePicture}
                          alt={buddy.name}
                          className="w-8 h-8 rounded-full border border-white dark:border-gray-700 shadow-sm flex-shrink-0"
                          fallbackSrc={`https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.name}&backgroundColor=b6e3f4&size=150`}
                        />
                      )}
                      
                      <div className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className={`text-xs ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </span>
                          {isOwnMessage && (
                            <div className="flex items-center">
                              <CheckCheck className="w-3 h-3 text-blue-100" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-2">
                <div className="flex items-end gap-2">
                  <LazyImage
                    src={buddy.profilePicture}
                    alt={buddy.name}
                    className="w-8 h-8 rounded-full border border-white dark:border-gray-700 shadow-sm"
                    fallbackSrc={`https://api.dicebear.com/7.x/avataaars/svg?seed=${buddy.name}&backgroundColor=b6e3f4&size=150`}
                  />
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${buddy.name}...`}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors">
                  <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
