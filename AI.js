// Grastavia AI Travel Assistant - NO API KEY REQUIRED!
// Complete working AI chatbot for Pakistan tourism

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
            <div id="chat-container" style="display: none; position: absolute; bottom: 70px; right: 0; width: 350px; height: 500px; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden; flex-direction: column;">
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
                        I can tell you about:<br>
                        🏔️ Tourist destinations<br>
                        🍛 Local Pakistani food<br>
                        📅 Best travel times<br>
                        🎭 Cultural tips<br><br>
                        <strong>Try asking me:</strong><br>
                        "What's in Hunza?"<br>
                        "Food in Lahore"<br>
                        "Best time for Swat"
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
    
    // Add event listeners
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

// Main AI response function - NO API KEY NEEDED!
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;
    
    input.value = '';
    addMessageToChat('user', message);
    addTypingIndicator();
    
    // Simulate AI thinking (0.5 second delay for realism)
    setTimeout(() => {
        removeTypingIndicator();
        const aiResponse = getAIResponse(message);
        addMessageToChat('ai', aiResponse);
        saveChatHistory(message, aiResponse);
    }, 500);
}

// The AI brain - all knowledge about Pakistan tourism
function getAIResponse(question) {
    const q = question.toLowerCase();
    
    // Destination questions
    if (q.includes('hunza') || q.includes('hunza valley')) {
        return "🏔️ **Hunza Valley** is amazing from April to October!\n\n✨ **Must-see:**\n• Attabad Lake (turquoise water)\n• Baltit Fort (700 years old)\n• Passu Cones (iconic peaks)\n• Eagle's Nest (sunset view)\n\n🍑 **Don't miss:** Local apricots, walnut cake, and rakhat (dried fruit rolls)!\n\n🎯 **Best months:** May-June (cherry blossoms) or September-October (autumn colors)";
    }
    
    if (q.includes('swat') || q.includes('swat valley') || q.includes('malam jabba')) {
        return "⛰️ **Swat Valley** – the 'Switzerland of Pakistan'!\n\n✨ **Top attractions:**\n• Malam Jabba (ski resort)\n• Mahodand Lake (boating)\n• Mingora (main city)\n• Fizagat Park\n\n🍽️ **Must eat:** Trout fish, chapli kebab, fresh apples\n\n📅 **Best time:** May-September (pleasant weather, green valleys)";
    }
    
    if (q.includes('naran') || q.includes('kaghan') || q.includes('saif') || q.includes('saif ul muluk')) {
        return "🏞️ **Naran Kaghan Valley** – a summer paradise!\n\n✨ **Attractions:**\n• Lake Saif-ul-Mulook (fairy tale lake)\n• River Kunhar (trout fishing)\n• Shogran (beautiful meadows)\n\n📅 **Best time:** June-September\n🎯 **Entry point:** Accessible from Islamabad (8-10 hours drive)";
    }
    
    if (q.includes('skardu') || q.includes('baltistan')) {
        return "🏔️ **Skardu** – gateway to the world's highest peaks!\n\n✨ **Must-visit:**\n• Shangrila Lake (Lower Kachura)\n• Cold Desert (unique!)\n• Satpara Lake\n• Katpana Desert\n\n🥨 **Local food:** Apricots, buckwheat bread (thukpa), butter tea\n\n📅 **Best:** May-October (pleasant weather)";
    }
    
    // City questions
    if (q.includes('lahore')) {
        return "🍛 **LAHORE** – Pakistan's cultural and food capital!\n\n🍢 **Must-eat food:**\n• Nihari at Anarkali\n• Butter Chicken at Food Street\n• Falooda in Gawalmandi\n• Seekh kebabs\n\n🏛️ **Places to visit:**\n• Badshahi Mosque\n• Lahore Fort\n• Food Street (MM Alam Road)\n• Liberty Market\n\n🎯 **Best time:** November-March (pleasant weather)";
    }
    
    if (q.includes('karachi')) {
        return "🌊 **KARACHI** – city of lights and beaches!\n\n🍛 **Famous food:**\n• Biryani from Burns Road\n• Haleem and Nihari\n• Street chai and parathas\n\n🏖️ **Attractions:**\n• Clifton Beach\n• Quaid's Mausoleum\n• Port Grand (nightlife)\n• TDF Ghar (cafe with view)\n\n📅 **Best time:** November-February (avoid summer heat)";
    }
    
    if (q.includes('islamabad')) {
        return "🌳 **ISLAMABAD** – the beautiful capital city!\n\n✨ **Top spots:**\n• Faisal Mosque (iconic!)\n• Pakistan Monument\n• Daman-e-Koh (city view)\n• Rawal Lake (boating)\n• Trail 5 (hiking)\n\n🍽️ **Food spots:**\n• Monal Restaurant (mountain view)\n• Saidpur Village (traditional)\n\n📅 **Best time:** October-April (cool weather)";
    }
    
    if (q.includes('peshawar')) {
        return "🏛️ **PESHAWAR** – gateway to Khyber Pass!\n\n✨ **Attractions:**\n• Peshawar Fort (Bala Hissar)\n• Khyber Pass (historic)\n• Mahabat Khan Mosque\n\n🍢 **Must eat:**\n• Chapli kebab (original!)\n• Mutton karahi\n• Kawa (green tea)\n\n🎯 **Best:** October-March (pleasant weather)";
    }
    
    if (q.includes('multan')) {
        return "🏺 **MULTAN** – city of saints and blue pottery!\n\n✨ **Visit:**\n• Shah Rukn-e-Alam Shrine\n• Multan Fort\n• Blue pottery workshops\n\n🍨 **Famous food:**\n• Sohan halwa (sweet)\n• Multani mangoes (summer)\n\n📅 **Best:** November-February (avoid May-June heat)";
    }
    
    if (q.includes('gilgit')) {
        return "🏔️ **GILGIT** – heart of mountain adventure!\n\n✨ **Attractions:**\n• Kargah Buddha (carved in rock)\n• Gilgit River\n• Naltar Valley (colored lakes)\n• Karakoram Highway views\n\n🎯 **Best time:** May-October\n🍎 **Specialty:** Fresh apples, apricots, and walnuts";
    }
    
    // Food questions
    if (q.includes('biryani')) {
        return "🍛 **BIRYANI** – Pakistan's most loved rice dish!\n\n📍 **Best cities:**\n• Karachi (Sindhi biryani – spicy)\n• Lahore (Punjabi biryani – mild)\n\n🥘 **What's in it:** Basmati rice, chicken/mutton, spices, potatoes (sometimes), fried onions, and raita on side!\n\n🔥 **Pro tip:** Ask for 'extra masala' if you like spicy!";
    }
    
    if (q.includes('nihari')) {
        return "🍖 **NIHARI** – slow-cooked meat curry, a breakfast/lunch tradition!\n\n📍 **Where to try:**\n• Lahore: Haveli, Anarkali\n• Karachi: Burns Road, Javed Nihari\n\n🥩 **What to order:** Nalli Nihari (with bone marrow) – it's the best!\n\n🍞 **Eat with:** Fresh naan bread, topped with ginger, green chilies, and lemon.";
    }
    
    if (q.includes('karahi')) {
        return "🍗 **CHICKEN KARAHI** – cooked in a wok, Pakistan's favorite!\n\n📍 **Best cities:**\n• Peshawar (original style)\n• Lahore (butter karahi)\n• Islamabad (many good restaurants)\n\n🔥 **Style choices:**\n• Peshawari: Simple, no tomatoes\n• Lahori: Rich, with tomatoes and butter\n\n🍞 **Pair with:** Garlic naan and raita";
    }
    
    if (q.includes('chapli') || q.includes('kebab')) {
        return "🍔 **CHAPLI KEBAB** – spicy flattened meat patties from Khyber Pakhtunkhwa!\n\n📍 **Best places:**\n• Peshawar (original!\n• Swat\n• Islamabad\n\n🌶️ **Ingredients:** Ground beef + pomegranate seeds + coriander + chili + special spices\n\n🔥 **Pro tip:** Eat fresh from tawa (griddle) with naan and mint chutney!";
    }
    
    if (q.includes('falooda')) {
        return "🍨 **FALOODA** – Pakistan's favorite dessert drink!\n\n📍 **Famous in:**\n• Lahore (Gawalmandi)\n• Karachi\n• Islamabad\n\n🥤 **What's inside:**\n• Rose syrup (pink color)\n• Vermicelli noodles\n• Basil seeds\n• Ice cream\n• Milk\n• Nuts\n\n🎯 **Best time:** Summer – it's super refreshing!";
    }
    
    if (q.includes('halwa') || (q.includes('sohan') && q.includes('halwa'))) {
        return "🍬 **SOHAN HALWA** – Multan's famous sweet treat!\n\n📍 **Only in Multan** – this is the original!\n\n🥜 **What's inside:**\n• Semolina\n• Ghee\n• Sugar\n• Almonds & pistachios\n• Cardamom\n\n🎁 **Buy as gift:** It's the perfect souvenir from Multan!\n\n📅 **Best time:** Winter (it's warming)";
    }
    
    // Travel time questions
    if ((q.includes('best') || q.includes('time') || q.includes('season') || q.includes('month')) && 
        (q.includes('visit') || q.includes('go') || q.includes('travel'))) {
        return "📅 **Best travel seasons in Pakistan:**\n\n🏔️ **Northern areas** (Hunza, Swat, Naran): May-October\n🌆 **Punjab & Lahore:** November-March (avoid summer heat)\n🌊 **Sindh & Karachi:** November-February\n🏛️ **KPK & Peshawar:** October-April\n\n🎯 **Most popular:** September-October (autumn colors in north)\n🌸 **Spring special:** March-April (cherry blossoms in Hunza!)";
    }
    
    // Cultural tips
    if (q.includes('culture') || q.includes('tips') || q.includes('etiquette')) {
        return "🎭 **Cultural tips for Pakistan:**\n\n🙏 **Greeting:** 'Assalam-o-Alaikum' (peace be upon you)\n\n👕 **Dress:** Modest clothing – cover shoulders/knees\n\n👟 **Mosques:** Remove shoes before entering\n\n🍛 **Eating:** Use right hand for eating\n\n💵 **Tipping:** 10-15% in restaurants\n\n📸 **Photos:** Always ask permission first\n\n🤝 **Hospitality:** You'll be treated like family!";
    }
    
    // Weather
    if (q.includes('weather') || q.includes('climate')) {
        return "🌤️ **Pakistan's weather by region:**\n\n🏔️ **North** (Hunza, Swat): Summer 15-25°C, Winter below 0°C\n🌆 **Punjab** (Lahore): Summer 30-45°C, Winter 5-20°C\n🌊 **South** (Karachi): Summer 30-40°C, Winter 15-25°C\n\n📅 **Summer:** May-September (hot except north)\n❄️ **Winter:** November-February (cold in north)\n🌸 **Spring/Fall:** March-April & October-November (best time!)";
    }
    
    // General welcome / help
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('assalam')) {
        return "🇵🇰 Assalam-o-Alaikum! Welcome to Grastavia! 🇵🇰\n\nI'm your AI travel guide for Pakistan. Ask me about:\n\n🏔️ **Destinations:** Hunza, Swat, Naran, Skardu, Lahore, Karachi, Islamabad\n🍛 **Food:** Biryani, Nihari, Karahi, Chapli kebab, Falooda\n📅 **Best times to visit** (summer/winter)\n🎭 **Cultural tips**\n✈️ **Travel advice**\n\nWhat would you like to know?";
    }
    
    if (q.includes('help') || q.includes('what can you')) {
        return "🆘 **I can help you with:**\n\n1️⃣ **Destinations** – Hunza, Swat, Naran, Skardu\n2️⃣ **Cities** – Lahore, Karachi, Islamabad, Peshawar\n3️⃣ **Food** – Famous dishes and where to try them\n4️⃣ **Travel seasons** – Best months to visit\n5️⃣ **Cultural tips** – Do's and don'ts\n\nJust ask me anything about Pakistan travel! 🗺️";
    }
    
    // Default response for anything else
    return "🇵🇰 Thanks for your interest in Pakistan! 🇵🇰\n\nI'm still learning, but I know about:\n\n📍 **Destinations:** Hunza, Swat, Naran, Skardu\n🌆 **Cities:** Lahore, Karachi, Islamabad, Peshawar\n🍛 **Food:** Biryani, Nihari, Karahi, Chapli kebab\n📅 **Best travel times**\n\nCould you rephrase your question about Pakistan tourism? Try asking:\n• 'Tell me about Hunza Valley'\n• 'What food is famous in Lahore?'\n• 'Best time to visit Swat'\n\nI'm here to help! 🗺️";
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
    
    // Convert markdown-style bold to HTML
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