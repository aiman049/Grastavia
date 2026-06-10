// Grastavia AI Travel Assistant - NO API KEY REQUIRED!
// Expanded with budget-based destination recommendations

// Create floating chat widget when page loads
document.addEventListener('DOMContentLoaded', () => {
    createAIChatWidget();
    loadChatHistory();
});

// Create the chat button and window
function createAIChatWidget() {
    const widgetHTML = `
        <div id="ai-chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <button id="chat-toggle-btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50px; padding: 15px 25px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 16px; font-weight: bold; transition: all 0.3s ease;">
                🤖 AI Travel Assistant
            </button>
            <div id="chat-container" style="display: none; position: absolute; bottom: 70px; right: 0; width: 380px; height: 550px; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden; flex-direction: column;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>🤖 Grastavia AI Guide</strong>
                        <div style="font-size: 12px; opacity: 0.9;">Ask me about Pakistan travel!</div>
                    </div>
                    <button id="close-chat" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 15px; background: #f8f9fa;">
                    <div style="text-align: center; color: #666; padding: 20px;">
                        🇵🇰 Welcome to Grastavia! 🇵🇰<br><br>
                        I can help you plan your perfect trip!<br><br>
                        💰 **Tell me your budget** (e.g., "budget 50,000 PKR")<br>
                        👥 **Tell me group size** (e.g., "2 people")<br>
                        🎯 **Tell me your preference** (e.g., "mountains", "beach", "culture")<br>
                        ⏱️ **Tell me duration** (e.g., "3 days")<br><br>
                        <strong>Try these examples:</strong><br>
                        • "Recommend a place for 30,000 PKR"<br>
                        • "Best mountain destination for family"<br>
                        • "Budget trip for 5 days"<br>
                        • "Cheap places near Islamabad"
                    </div>
                </div>
                <div style="padding: 15px; background: white; border-top: 1px solid #dee2e6;">
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="chat-input" placeholder="Ask about Pakistan..." style="flex: 1; padding: 10px; border: 1px solid #dee2e6; border-radius: 8px; font-size: 14px;">
                        <button id="send-message" style="background: #667eea; color: white; border: none; border-radius: 8px; padding: 10px 20px; cursor: pointer;">Send</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
    
    document.getElementById('chat-toggle-btn').addEventListener('click', toggleChat);
    document.getElementById('close-chat').addEventListener('click', toggleChat);
    document.getElementById('send-message').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function toggleChat() {
    const container = document.getElementById('chat-container');
    const isVisible = container.style.display === 'flex';
    container.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
        document.getElementById('chat-input').focus();
    }
}

// Store user preferences for smarter recommendations
let userPreferences = {
    budget: null,
    groupSize: null,
    preference: null,
    duration: null
};

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;
    
    input.value = '';
    addMessageToChat('user', message);
    addTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        extractPreferences(message);
        const aiResponse = getAIResponse(message);
        addMessageToChat('ai', aiResponse);
        saveChatHistory(message, aiResponse);
    }, 500);
}

// Extract budget, group size, preferences from user message
function extractPreferences(message) {
    const msg = message.toLowerCase();
    
    const budgetMatch = msg.match(/(\d+[\s]*(?:k|thousand|lakh)?)[\s]*(?:pkr|rupees?|rs|budget)/i) ||
                        msg.match(/budget[\s]*[:\s]*(\d+)/i) ||
                        msg.match(/(\d+)[\s]*(?:k|thousand)/i);
    
    if (budgetMatch) {
        let budgetValue = budgetMatch[1].toString();
        if (budgetValue.includes('k')) {
            userPreferences.budget = parseInt(budgetValue) * 1000;
        } else if (budgetValue.includes('lakh')) {
            userPreferences.budget = parseInt(budgetValue) * 100000;
        } else {
            userPreferences.budget = parseInt(budgetValue);
        }
    }
    
    const groupMatch = msg.match(/(\d+)[\s]*(?:person|people|pax|family|member)/i);
    if (groupMatch) {
        userPreferences.groupSize = parseInt(groupMatch[1]);
    }
    
    if (msg.includes('mountain') || msg.includes('hill') || msg.includes('peak')) {
        userPreferences.preference = 'mountains';
    } else if (msg.includes('beach') || msg.includes('sea')) {
        userPreferences.preference = 'beach';
    } else if (msg.includes('culture') || msg.includes('history')) {
        userPreferences.preference = 'culture';
    } else if (msg.includes('adventure')) {
        userPreferences.preference = 'adventure';
    } else if (msg.includes('family') || msg.includes('kids')) {
        userPreferences.preference = 'family';
    }
    
    const durationMatch = msg.match(/(\d+)[\s]*(?:day|days|night|week)/i);
    if (durationMatch) {
        userPreferences.duration = parseInt(durationMatch[1]);
    }
}

// Smart destination recommendation based on budget
function getBudgetRecommendation(budget, groupSize, preference, duration) {
    const perPersonBudget = groupSize ? budget / groupSize : budget;
    const dailyBudget = duration ? perPersonBudget / duration : perPersonBudget;
    
    if (perPersonBudget <= 15000) {
        if (preference === 'mountains') {
            return "🏔️ **Budget Mountain Getaway (Under 15,000 PKR)**\n\n📍 **Recommended:** Nathia Gali, Murree, or Ayubia\n\n💰 **Estimated Cost:** 10,000-15,000 PKR per person\n\n✨ **Includes:** Bus transport, budget hotel, local food\n\n🎯 **Must-do:** Chairlift at Murree, hiking trails";
        } else if (preference === 'culture') {
            return "🏛️ **Budget Cultural Tour (Under 15,000 PKR)**\n\n📍 **Recommended:** Lahore or Rawalpindi\n\n💰 **Estimated Cost:** 12,000-15,000 PKR per person\n\n🎯 **Must-see:** Badshahi Mosque (free), Lahore Fort, Anarkali Bazaar";
        } else {
            return "💰 **Best Budget Destinations (Under 15,000 PKR)**\n\n📍 **Top picks:**\n1. Murree - 10,000-12,000 PKR\n2. Nathia Gali - 12,000-15,000 PKR\n3. Lahore - 10,000-15,000 PKR\n4. Islamabad - 12,000-15,000 PKR";
        }
    } else if (perPersonBudget <= 40000) {
        if (preference === 'mountains') {
            return "🏔️ **Mid-Range Mountain Escape (15,000-40,000 PKR)**\n\n📍 **Recommended:** Swat Valley or Naran Kaghan\n\n💰 **Estimated Cost:** 25,000-35,000 PKR per person\n\n🎯 **Highlights:** Malam Jabba chairlift, Lake Saif-ul-Mulook";
        } else if (preference === 'beach') {
            return "🌊 **Mid-Range Beach Getaway (15,000-40,000 PKR)**\n\n📍 **Recommended:** Karachi or Gwadar\n\n💰 **Estimated Cost:** 25,000-35,000 PKR per person\n\n🎯 **Highlights:** Clifton Beach, Port Grand, Hammerhead";
        } else {
            return "💰 **Best Mid-Range Destinations (15,000-40,000 PKR)**\n\n📍 **Top picks:**\n1. Swat Valley - 25,000-35,000 PKR\n2. Naran Kaghan - 20,000-30,000 PKR\n3. Lahore + Multan - 30,000-40,000 PKR";
        }
    } else if (perPersonBudget <= 80000) {
        if (preference === 'mountains') {
            return "🏔️ **Premium Mountain Adventure (40,000-80,000 PKR)**\n\n📍 **Recommended:** Hunza Valley or Skardu\n\n💰 **Estimated Cost:** 60,000-75,000 PKR per person\n\n🎯 **Experiences:** Attabad Lake boat, Baltit Fort, Shangrila Lake";
        } else if (preference === 'adventure') {
            return "⛰️ **Adventure Package (40,000-80,000 PKR)**\n\n📍 **Recommended:** Fairy Meadows or Ratti Gali Lake\n\n💰 **Estimated Cost:** 50,000-70,000 PKR per person\n\n🎯 **Adventure:** Trek to Nanga Parbat base camp, alpine lake trekking";
        } else {
            return "💰 **Best Comfortable Destinations (40,000-80,000 PKR)**\n\n📍 **Top picks:**\n1. Hunza Valley - 60,000-75,000 PKR\n2. Skardu - 65,000-80,000 PKR\n3. Fairy Meadows - 50,000-60,000 PKR";
        }
    } else {
        return "✨ **Luxury Pakistan Tour (80,000+ PKR)**\n\n📍 **Ultimate experience:** Multi-city luxury tour\n\n💰 **Estimated Cost:** 120,000-200,000 PKR per person\n\n🏰 **Includes:** Business class flights, 5-star hotels, private car, personal guide\n\n🏨 **Recommended:** Serena Hotels, Faletti's, Marriott";
    }
}

// Main AI response function
function getAIResponse(question) {
    const q = question.toLowerCase();
    
    // Budget-based recommendations
    if ((q.includes('recommend') || q.includes('suggest') || q.includes('best place') || q.includes('where should i go')) &&
        (q.includes('budget') || q.includes('pkr') || q.includes('rupees') || q.includes('rs') || q.includes('cost'))) {
        
        if (userPreferences.budget) {
            return getBudgetRecommendation(
                userPreferences.budget, 
                userPreferences.groupSize, 
                userPreferences.preference,
                userPreferences.duration
            );
        } else {
            return "💰 **Tell me your budget first!** 💰\n\nPlease share your budget (e.g., \"50,000 PKR\"), group size, and preference.\n\n**Example:** \"Recommend a place for 40,000 PKR for 2 people for 4 days in mountains\"";
        }
    }
    
    // Cheap/Budget destinations
    if (q.includes('cheap') || q.includes('budget friendly') || q.includes('affordable')) {
        return "💰 **Budget-Friendly Destinations in Pakistan** 💰\n\n📍 **Under 15,000 PKR per person:**\n\n1. Murree (10,000-12,000 PKR)\n2. Nathia Gali (12,000-15,000 PKR)\n3. Lahore (10,000-15,000 PKR)\n4. Islamabad (12,000-15,000 PKR)\n\n**Tell me your exact budget for personalized recommendations!**";
    }
    
    // Family travel
    if (q.includes('family') || q.includes('kids')) {
        return "👨‍👩‍👧‍👦 **Family-Friendly Destinations** 👨‍👩‍👧‍👦\n\n📍 **Top picks:**\n1. Murree/Nathia Gali (15,000-25,000 PKR/family)\n2. Lahore (20,000-30,000 PKR/family)\n3. Swat Valley (30,000-50,000 PKR/family)\n\n**How many family members and budget?**";
    }
    
    // Solo travel
    if (q.includes('solo') || q.includes('alone')) {
        return "🚶 **Solo Travel Destinations** 🚶\n\n📍 **Best for solo:**\n1. Hunza Valley (25,000-35,000 PKR) - Safe, friendly\n2. Lahore (12,000-20,000 PKR) - Vibrant culture\n3. Islamabad (15,000-20,000 PKR) - Very safe\n\n**What's your budget?**";
    }
    
    // Weekend trips
    if (q.includes('weekend') || (q.includes('2 days') || q.includes('3 days'))) {
        return "🏃 **Weekend Getaways (2-3 days)** 🏃\n\n📍 **From Islamabad:** Murree (8,000-12,000 PKR)\n📍 **From Lahore:** Islamabad (10,000-15,000 PKR)\n📍 **From Karachi:** Hawksbay (5,000-8,000 PKR)\n\n**Which city are you traveling from?**";
    }
    
    // Destination-specific queries
    if (q.includes('hunza') || q.includes('hunza valley')) {
        return "🏔️ **Hunza Valley**\n\n✨ **Must-see:** Attabad Lake, Baltit Fort, Passu Cones, Eagle's Nest\n\n📅 **Best time:** May-June or September-October\n\n💰 **Budget:** 25,000-80,000 PKR depending on style";
    }
    
    if (q.includes('swat') || q.includes('swat valley')) {
        return "⛰️ **Swat Valley**\n\n✨ **Top attractions:** Malam Jabba, Mahodand Lake, Mingora\n\n📅 **Best time:** May-September\n\n💰 **Budget:** 20,000-50,000 PKR per person";
    }
    
    if (q.includes('lahore')) {
        return "🍛 **Lahore**\n\n✨ **Must-see:** Badshahi Mosque, Lahore Fort, Food Street\n\n🍢 **Must-eat:** Nihari, Butter Chicken, Falooda\n\n💰 **Budget:** 10,000-30,000 PKR for 3 days";
    }
    
    if (q.includes('karachi')) {
        return "🌊 **Karachi**\n\n✨ **Attractions:** Clifton Beach, Quaid's Mausoleum, Port Grand\n\n🍛 **Famous food:** Biryani, Haleem, Nihari\n\n💰 **Budget:** 15,000-35,000 PKR for 3-4 days";
    }
    
    // Price comparison
    if (q.includes('compare') || (q.includes('cheaper') || q.includes('expensive'))) {
        return "💰 **Destination Cost Comparison** 💰\n\n🟢 **Cheap (10,000-20,000 PKR):** Murree, Nathia Gali, Islamabad\n\n🟡 **Mid-range (25,000-40,000 PKR):** Swat, Naran, Lahore\n\n🔴 **Premium (50,000-80,000 PKR):** Hunza, Skardu\n\n**Want detailed breakdown for any destination?**";
    }
    
    // Help / welcome
    if (q.includes('hello') || q.includes('hi') || q.includes('assalam')) {
        return "🇵🇰 Assalam-o-Alaikum! Welcome to Grastavia! 🇵🇰\n\nI can help you with:\n💰 Budget recommendations\n🏔️ Destination guides\n👨‍👩‍👧‍👦 Family/Solo trips\n🍛 Food recommendations\n\n**Try:** \"Recommend a place for 30,000 PKR\" or \"Best family destination\"";
    }
    
    // Default response
    return "🇵🇰 Thanks for your interest in Pakistan! 🇵🇰\n\nTry asking:\n• 'Recommend a place for 40,000 PKR for 2 people'\n• 'Best family destination'\n• 'Cheapest places to visit'\n• 'Compare cost of Hunza vs Swat'\n\nI'm here to help plan your perfect trip! 🗺️";
}

// UI helper functions
function addMessageToChat(type, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '12px';
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = type === 'user' ? 'flex-end' : 'flex-start';
    
    const bubble = document.createElement('div');
    bubble.style.maxWidth = '80%';
    bubble.style.padding = '10px 12px';
    bubble.style.borderRadius = '12px';
    bubble.style.backgroundColor = type === 'user' ? '#667eea' : '#e9ecef';
    bubble.style.color = type === 'user' ? 'white' : '#333';
    bubble.style.fontSize = '14px';
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.style.wordWrap = 'break-word';
    
    bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.marginBottom = '12px';
    typingDiv.style.display = 'flex';
    typingDiv.style.justifyContent = 'flex-start';
    
    const bubble = document.createElement('div');
    bubble.style.backgroundColor = '#e9ecef';
    bubble.style.padding = '10px 15px';
    bubble.style.borderRadius = '12px';
    bubble.style.fontSize = '14px';
    bubble.style.color = '#666';
    bubble.textContent = '🤔 Grastavia AI is thinking...';
    
    typingDiv.appendChild(bubble);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function saveChatHistory(userMsg, aiMsg) {
    const history = JSON.parse(localStorage.getItem('grastavia_chat_history') || '[]');
    history.push({
        user: userMsg,
        ai: aiMsg,
        timestamp: new Date().toISOString()
    });
    if (history.length > 50) history.shift();
    localStorage.setItem('grastavia_chat_history', JSON.stringify(history));
}

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('grastavia_chat_history') || '[]');
    if (history.length > 0) {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.innerHTML = '';
        history.slice(-10).forEach(conv => {
            addMessageToChat('user', conv.user);
            addMessageToChat('ai', conv.ai);
        });
    }
}