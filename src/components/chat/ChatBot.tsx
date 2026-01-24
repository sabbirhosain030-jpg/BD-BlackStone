'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    searchProducts,
    checkStock,
    getChatCategories,
    getCategoryProducts,
    checkOrderStatus,
    getNewArrivalsForChat,
    getFeaturedForChat,
    getDiscountedProducts,
    type ChatProduct
} from '@/app/chatbot-actions';
import './chatbot.css';

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    products?: ChatProduct[];
    quickActions?: string[];
    timestamp: Date;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Welcome message
            setTimeout(() => {
                addBotMessage(
                    "👋 Welcome to BlackStone BD! I'm here to help you find products, check prices, and track your orders. How can I assist you today?",
                    undefined,
                    ['Show new arrivals', 'Browse categories', 'Check discounts', 'Track my order']
                );
            }, 500);
        }
    }, [isOpen]);

    const addBotMessage = (content: string, products?: ChatProduct[], quickActions?: string[]) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'bot',
            content,
            products,
            quickActions,
            timestamp: new Date()
        }]);
    };

    const addUserMessage = (content: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'user',
            content,
            timestamp: new Date()
        }]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        addUserMessage(userMessage);
        setIsTyping(true);

        // Process the message
        await processMessage(userMessage);
        setIsTyping(false);
    };

    const processMessage = async (message: string) => {
        const lowerMessage = message.toLowerCase();

        try {
            // New arrivals
            if (lowerMessage.includes('new') || lowerMessage.includes('latest') || lowerMessage.includes('arrivals')) {
                const products = await getNewArrivalsForChat();
                if (products.length > 0) {
                    addBotMessage('Here are our latest arrivals:', products, ['Browse all products', 'Show categories']);
                } else {
                    addBotMessage('No new arrivals at the moment. Check back soon!');
                }
            }
            // Featured products
            else if (lowerMessage.includes('featured') || lowerMessage.includes('popular') || lowerMessage.includes('best')) {
                const products = await getFeaturedForChat();
                if (products.length > 0) {
                    addBotMessage('Here are our featured products:', products, ['Show new arrivals', 'Check discounts']);
                } else {
                    addBotMessage('No featured products available right now.');
                }
            }
            // Discounts
            else if (lowerMessage.includes('discount') || lowerMessage.includes('sale') || lowerMessage.includes('offer')) {
                const products = await getDiscountedProducts();
                if (products.length > 0) {
                    addBotMessage('Check out these amazing deals:', products, ['Show new arrivals', 'Browse categories']);
                } else {
                    addBotMessage('No discounted products available at the moment. Check back later for great deals!');
                }
            }
            // Categories
            else if (lowerMessage.includes('categor') || lowerMessage.includes('browse')) {
                const categories = await getChatCategories();
                if (categories.length > 0) {
                    const categoryList = categories.map(c => c.name).join(', ');
                    addBotMessage(
                        `We have the following categories: ${categoryList}. Which category would you like to explore?`,
                        undefined,
                        categories.slice(0, 4).map(c => `Show ${c.name}`)
                    );
                } else {
                    addBotMessage('No categories available at the moment.');
                }
            }
            // Category product search
            else if (lowerMessage.includes('show ') && (lowerMessage.includes('shoes') || lowerMessage.includes('shirts') || lowerMessage.includes('pants') || lowerMessage.includes('jackets'))) {
                const categoryName = lowerMessage.replace('show ', '').trim();
                const categories = await getChatCategories();
                const category = categories.find(c => c.name.toLowerCase().includes(categoryName));

                if (category) {
                    const products = await getCategoryProducts(category.slug);
                    if (products.length > 0) {
                        addBotMessage(`Here are products in ${category.name}:`, products, ['Show new arrivals', 'Browse categories']);
                    } else {
                        addBotMessage(`No products found in ${category.name}.`);
                    }
                } else {
                    const results = await searchProducts(categoryName);
                    if (results.length > 0) {
                        addBotMessage(`I found these products for "${categoryName}":`, results);
                    } else {
                        addBotMessage(`Sorry, I couldn't find products matching "${categoryName}". Try browsing our categories!`, undefined, ['Show categories', 'Show new arrivals']);
                    }
                }
            }
            // Stock check
            else if (lowerMessage.includes('stock') || lowerMessage.includes('available') || lowerMessage.includes('in stock')) {
                const productName = lowerMessage.replace(/is|stock|available|in|for|the|\?/g, '').trim();
                if (productName) {
                    const result = await checkStock(productName);
                    if (result.found && result.product) {
                        const stockStatus = result.product.stock > 10 ? 'in stock' :
                            result.product.stock > 0 ? `low stock (${result.product.stock} left)` : 'out of stock';
                        addBotMessage(`${result.product.name} is ${stockStatus}.`, [result.product]);
                    } else {
                        addBotMessage(`Sorry, I couldn't find "${productName}". Try searching for something else!`, undefined, ['Show new arrivals', 'Browse categories']);
                    }
                } else {
                    addBotMessage('Which product would you like to check stock for?');
                }
            }
            // Price inquiry
            else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
                const productName = lowerMessage.replace(/price|cost|how much|is|the|of|for|\?/g, '').trim();
                if (productName) {
                    const result = await checkStock(productName);
                    if (result.found && result.product) {
                        addBotMessage(`Here's the pricing for ${result.product.name}:`, [result.product]);
                    } else {
                        addBotMessage(`Sorry, I couldn't find "${productName}". Try searching for something else!`, undefined, ['Show new arrivals', 'Browse categories']);
                    }
                } else {
                    addBotMessage('Which product price would you like to know?');
                }
            }
            // Order tracking
            else if (lowerMessage.includes('track') || lowerMessage.includes('order') && (lowerMessage.includes('#') || lowerMessage.includes('ord-'))) {
                const orderNumber = message.match(/(ORD-\d+)/i)?.[0] || message.match(/#(\d+)/)?.[1];
                if (orderNumber) {
                    const order = await checkOrderStatus(orderNumber);
                    if (order) {
                        addBotMessage(
                            `Order ${order.orderNumber}:\n` +
                            `Status: ${order.status}\n` +
                            `Total: ৳${order.total.toLocaleString()}\n` +
                            `Date: ${new Date(order.createdAt).toLocaleDateString()}\n` +
                            `Customer: ${order.customerName}`
                        );
                    } else {
                        addBotMessage(`Sorry, I couldn't find order "${orderNumber}". Please check the order number and try again.`);
                    }
                } else {
                    addBotMessage('Please provide your order number (e.g., ORD-12345) to track your order.');
                }
            }
            // General search
            else if (lowerMessage.length > 2) {
                const results = await searchProducts(message);
                if (results.length > 0) {
                    addBotMessage(`I found these products for "${message}":`, results, ['Show more', 'Browse categories']);
                } else {
                    addBotMessage(
                        `Sorry, I couldn't find any products matching "${message}". Would you like to browse our categories or see new arrivals?`,
                        undefined,
                        ['Show new arrivals', 'Browse categories', 'Show discounts']
                    );
                }
            }
            // Default
            else {
                addBotMessage(
                    "I'm here to help! You can ask me to:\n" +
                    "• Search for products\n" +
                    "• Check prices and stock\n" +
                    "• Browse categories\n" +
                    "• Track your order\n" +
                    "• See new arrivals or discounts",
                    undefined,
                    ['Show new arrivals', 'Browse categories', 'Check discounts']
                );
            }
        } catch (error) {
            console.error('Error processing message:', error);
            addBotMessage('Sorry, I encountered an error. Please try again!');
        }
    };

    const handleQuickAction = (action: string) => {
        setInput(action);
        handleSend();
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-title">
                            <div>
                                <h3>BlackStone Assistant</h3>
                                <p>Always here to help</p>
                            </div>
                        </div>
                        <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chatbot-message ${msg.type}`}>
                                <div>
                                    <div className="chatbot-message-content">
                                        {msg.content}
                                    </div>

                                    {msg.products && msg.products.length > 0 && (
                                        <div style={{ marginTop: '8px' }}>
                                            {msg.products.map((product) => (
                                                <Link href={`/products/${product.id}`} key={product.id}>
                                                    <div className="chatbot-product-card">
                                                        <img
                                                            src={JSON.parse(product.images)[0]}
                                                            alt={product.name}
                                                            className="chatbot-product-image"
                                                        />
                                                        <div className="chatbot-product-info">
                                                            <div className="chatbot-product-name">{product.name}</div>
                                                            <div className="chatbot-product-category">{product.categoryName}</div>
                                                            <div className="chatbot-product-price">
                                                                ৳{product.price.toLocaleString()}
                                                                {product.previousPrice && (
                                                                    <span className="chatbot-product-price-old">
                                                                        ৳{product.previousPrice.toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className={`chatbot-product-stock ${product.stock > 10 ? 'in-stock' :
                                                                    product.stock > 0 ? 'low-stock' : 'out-of-stock'
                                                                }`}>
                                                                {product.stock > 10 ? '✓ In Stock' :
                                                                    product.stock > 0 ? `⚠ Only ${product.stock} left` : '✗ Out of Stock'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {msg.quickActions && msg.quickActions.length > 0 && (
                                        <div className="chatbot-quick-actions">
                                            {msg.quickActions.map((action, idx) => (
                                                <button
                                                    key={idx}
                                                    className="chatbot-quick-action"
                                                    onClick={() => handleQuickAction(action)}
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chatbot-message bot">
                                <div className="chatbot-typing">
                                    <div className="chatbot-typing-dot"></div>
                                    <div className="chatbot-typing-dot"></div>
                                    <div className="chatbot-typing-dot"></div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-container">
                        <input
                            type="text"
                            className="chatbot-input"
                            placeholder="Ask about products, prices, or orders..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            className="chatbot-send"
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
