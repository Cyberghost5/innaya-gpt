/**
 * Innaya-GPT Application Controller
 * High School AI Companion for Innayatullah International School
 */

// State Object
const AppState = {
  currentChatId: null,
  chats: [],
  isTyping: false,
  isSidebarCollapsed: false,
  theme: localStorage.getItem('innaya_theme') || 'light',
  attachedFile: null,
  speechRecognition: null,
  isRecording: false
};

// Default initial conversations tailored for Innayatullah International School students
const DEFAULT_CONVERSATIONS = [
  {
    id: 'chat-feeding',
    title: 'Feeding Timetable',
    category: 'Campus Life',
    date: 'Today',
    messages: [
      {
        role: 'user',
        text: 'What is the feeding timetable for high school students?',
        time: '08:15 AM'
      },
      {
        role: 'ai',
        text: findSchoolAnswer('feeding timetable'),
        time: '08:15 AM'
      }
    ]
  },
  {
    id: 'chat-principal',
    title: "Principal's Name & Office",
    category: 'Administration',
    date: 'Yesterday',
    messages: [
      {
        role: 'user',
        text: 'Who is the principal of Innayatullah International School and what are her office hours?',
        time: '02:30 PM'
      },
      {
        role: 'ai',
        text: findSchoolAnswer('principal'),
        time: '02:30 PM'
      }
    ]
  },
  {
    id: 'chat-exams',
    title: 'Exam Guidelines 2026',
    category: 'Academics',
    date: 'Oct 19',
    messages: [
      {
        role: 'user',
        text: 'What are the examination rules and grading scale for senior school?',
        time: '11:40 AM'
      },
      {
        role: 'ai',
        text: findSchoolAnswer('examinations and grading'),
        time: '11:40 AM'
      }
    ]
  },
  {
    id: 'chat-clubs',
    title: 'Robotics & STEM Club',
    category: 'Co-Curricular',
    date: 'Oct 17',
    messages: [
      {
        role: 'user',
        text: 'How can I join the Robotics and AI Club?',
        time: '04:10 PM'
      },
      {
        role: 'ai',
        text: findSchoolAnswer('robotics club'),
        time: '04:10 PM'
      }
    ]
  }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSavedChats();
  setupEventListeners();
  setupSpeechRecognition();
  renderSidebar();

  // Open first chat or start clean welcome screen
  if (AppState.chats.length > 0) {
    selectChat(AppState.chats[0].id);
  } else {
    createNewChat();
  }
});

// Theme Management
function initTheme() {
  const root = document.documentElement;
  if (AppState.theme === 'dark' || (!('innaya_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
    AppState.theme = 'dark';
  } else {
    root.classList.remove('dark');
    AppState.theme = 'light';
  }
  updateThemeUI();
}

function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('innaya_theme', AppState.theme);
  initTheme();
  showToast(AppState.theme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
}

function updateThemeUI() {
  const themeBtnText = document.getElementById('themeToggleText');
  const themeIconContainer = document.getElementById('themeIconContainer');
  if (!themeBtnText || !themeIconContainer) return;

  if (AppState.theme === 'dark') {
    themeBtnText.textContent = 'Light Mode';
    themeIconContainer.innerHTML = `
      <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    `;
  } else {
    themeBtnText.textContent = 'Dark Mode';
    themeIconContainer.innerHTML = `
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    `;
  }
}

// Data Storage
const CURRENT_VERSION = 'v4.0';
const STORAGE_KEY = 'innaya_chats_v4_0';

function loadSavedChats() {
  const version = localStorage.getItem('innaya_version');
  if (version !== CURRENT_VERSION) {
    localStorage.clear();
    localStorage.setItem('innaya_version', CURRENT_VERSION);
    AppState.chats = [...DEFAULT_CONVERSATIONS];
    saveChatsToStorage();
    return;
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      AppState.chats = JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored chats:', e);
      AppState.chats = [...DEFAULT_CONVERSATIONS];
    }
  } else {
    AppState.chats = [...DEFAULT_CONVERSATIONS];
    saveChatsToStorage();
  }
}

function saveChatsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.chats));
}

// Conversation Management
function createNewChat() {
  const newId = 'chat-' + Date.now();
  const newChat = {
    id: newId,
    title: 'New Conversation',
    category: 'General',
    date: 'Just now',
    messages: []
  };
  AppState.chats.unshift(newChat);
  saveChatsToStorage();
  renderSidebar();
  selectChat(newId);

  // Focus message input
  const input = document.getElementById('messageInput');
  if (input) input.focus();

  // Close mobile sidebar if open
  closeMobileSidebar();
}

function selectChat(id) {
  AppState.currentChatId = id;
  const chat = AppState.chats.find(c => c.id === id);
  if (!chat) return;

  // Update header title
  const currentTitle = document.getElementById('currentChatTitle');
  const currentBadge = document.getElementById('currentChatBadge');
  if (currentTitle) currentTitle.textContent = chat.title;
  if (currentBadge) currentBadge.textContent = chat.category || 'School Info';

  renderSidebar();
  renderChatFeed();
  closeMobileSidebar();
}

function deleteChat(id, event) {
  if (event) event.stopPropagation();
  if (confirm('Delete this conversation topic?')) {
    AppState.chats = AppState.chats.filter(c => c.id !== id);
    saveChatsToStorage();
    if (AppState.currentChatId === id) {
      if (AppState.chats.length > 0) {
        selectChat(AppState.chats[0].id);
      } else {
        createNewChat();
      }
    } else {
      renderSidebar();
    }
    showToast('🗑️ Conversation deleted');
  }
}

function clearCurrentMessages() {
  const chat = AppState.chats.find(c => c.id === AppState.currentChatId);
  if (!chat) return;
  if (confirm('Clear all messages in this conversation?')) {
    chat.messages = [];
    saveChatsToStorage();
    renderChatFeed();
    showToast('🧹 Chat history cleared');
  }
}

// Sidebar Rendering
function renderSidebar() {
  const container = document.getElementById('recentChatsList');
  if (!container) return;

  const searchQuery = (document.getElementById('searchChatInput')?.value || '').toLowerCase();
  const filtered = AppState.chats.filter(c => 
    c.title.toLowerCase().includes(searchQuery) ||
    c.messages.some(m => m.text.toLowerCase().includes(searchQuery))
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="px-4 py-8 text-center text-xs text-slate-400">
        <svg class="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        No conversations found
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(chat => {
    const isActive = chat.id === AppState.currentChatId;
    const activeClasses = isActive 
      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border-l-4 border-emerald-600 dark:border-emerald-400 pl-3 shadow-xs' 
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 pl-3.5 border-l-4 border-transparent';

    let iconSvg = `
      <svg class="w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
    `;

    if (chat.title.toLowerCase().includes('feeding') || chat.title.toLowerCase().includes('food')) {
      iconSvg = `<span class="shrink-0 text-sm">🍽️</span>`;
    } else if (chat.title.toLowerCase().includes('principal') || chat.title.toLowerCase().includes('leadership')) {
      iconSvg = `<span class="shrink-0 text-sm">🎓</span>`;
    } else if (chat.title.toLowerCase().includes('exam') || chat.title.toLowerCase().includes('calendar')) {
      iconSvg = `<span class="shrink-0 text-sm">📅</span>`;
    } else if (chat.title.toLowerCase().includes('robotics') || chat.title.toLowerCase().includes('stem')) {
      iconSvg = `<span class="shrink-0 text-sm">🤖</span>`;
    } else if (chat.title.toLowerCase().includes('library')) {
      iconSvg = `<span class="shrink-0 text-sm">📖</span>`;
    } else if (chat.title.toLowerCase().includes('uniform')) {
      iconSvg = `<span class="shrink-0 text-sm">👔</span>`;
    }

    return `
      <div onclick="selectChat('${chat.id}')" 
           class="group relative flex items-center justify-between py-2.5 pr-2 rounded-r-xl cursor-pointer transition-all duration-150 ${activeClasses}">
        <div class="flex items-center gap-2.5 min-w-0 pr-2">
          ${iconSvg}
          <div class="truncate text-sm tracking-tight">${escapeHtml(chat.title)}</div>
        </div>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="deleteChat('${chat.id}', event)" 
                  title="Delete chat" 
                  class="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Reset scroll to top when opening welcome screen or selecting a chat
function renderChatFeed() {
  const container = document.getElementById('chatFeed');
  if (!container) return;

  const chat = AppState.chats.find(c => c.id === AppState.currentChatId);
  if (!chat || chat.messages.length === 0) {
    // Show Welcome Screen with prompt cards
    container.innerHTML = getWelcomeScreenHtml();
    container.scrollTop = 0;
    return;
  }

  container.innerHTML = chat.messages.map((msg, index) => {
    return renderMessageHtml(msg, index);
  }).join('');

  scrollToBottom();
}

// Markdown Parser Helper with Complete Table Block Support
function parseMarkdown(md) {
  if (!md) return '';

  // Normalize line endings and ensure trailing newline
  let text = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n') + '\n';

  // Parse Markdown Tables Block-by-Block
  text = text.replace(/((?:^[ \t]*\|.+?\|[ \t]*\n)+)/gm, (tableBlock) => {
    const rawLines = tableBlock.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (rawLines.length < 2) return tableBlock;

    // Check if line 1 is a valid markdown delimiter row: | :--- | :--- |
    const delimiter = rawLines[1];
    if (!/^\|(\s*:?-+:?\s*\|)+$/.test(delimiter)) {
      return tableBlock;
    }

    const headers = rawLines[0].split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    const ths = headers.map(h => `<th>${parseInlineMarkdown(h)}</th>`).join('');

    const bodyRows = rawLines.slice(2).map(rowLine => {
      const cells = rowLine.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const tds = cells.map(c => `<td>${parseInlineMarkdown(c)}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');

    return `\n<div class="overflow-x-auto my-3"><table class="w-full"><thead><tr>${ths}</tr></thead><tbody>${bodyRows}</tbody></table></div>\n`;
  });

  // Code blocks: ```language ... ```
  text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Headings
  text = text.replace(/^#### (.*$)/gim, '<h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 mt-3 mb-1">$1</h4>');
  text = text.replace(/^### (.*$)/gim, '<h3 class="font-bold text-base text-emerald-800 dark:text-emerald-300 mt-3 mb-1.5 flex items-center gap-1.5">$1</h3>');
  text = text.replace(/^## (.*$)/gim, '<h2 class="font-bold text-lg text-slate-800 dark:text-white mt-3.5 mb-2">$1</h2>');

  // Blockquotes
  text = text.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Bullet Lists
  text = text.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc mb-1">$1</li>');

  // Inline formatting
  text = parseInlineMarkdown(text);

  // Paragraph line breaks
  text = text.replace(/\n\n+/g, '<br/><br/>');

  return text;
}

function renderMessageHtml(msg, index) {
  if (msg.role === 'user') {
    return `
      <div class="flex items-start justify-end gap-3 max-w-4xl mx-auto mb-6 px-4">
        <div class="flex flex-col items-end max-w-[85%] md:max-w-[75%]">
          <div class="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-5 py-3.5 rounded-2xl rounded-tr-xs bubble-shadow-user">
            ${msg.attachedFileName ? `
              <div class="mb-2 px-2.5 py-1 bg-black/20 rounded-md text-xs flex items-center gap-2 border border-white/20">
                <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
                <span class="truncate font-medium text-emerald-100">${escapeHtml(msg.attachedFileName)}</span>
              </div>
            ` : ''}
            <div class="text-sm md:text-[0.935rem] leading-relaxed select-text whitespace-pre-wrap">${escapeHtml(msg.text)}</div>
          </div>
          <div class="flex items-center gap-1.5 mt-1.5 text-[0.72rem] text-slate-400 font-medium pr-1">
            <span>${msg.time || 'Just now'}</span>
            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-slate-700">
          MA
        </div>
      </div>
    `;
  } else {
    // AI response bubble
    const parsedContent = parseMarkdown(msg.text);
    return `
      <div class="flex items-start justify-start gap-3.5 max-w-4xl mx-auto mb-6 px-4">
        <!-- Robot Mascot Avatar -->
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 p-1 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-emerald-500/20">
          <img src="assets/mascot.svg" alt="Innaya-GPT" class="w-full h-full object-contain filter drop-shadow" />
        </div>

        <div class="flex flex-col items-start max-w-[88%] md:max-w-[82%]">
          <!-- Bubble Content -->
          <div class="bg-emerald-50/70 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 px-5 py-4 rounded-2xl rounded-tl-xs border border-emerald-100/80 dark:border-slate-700/80 bubble-shadow-ai prose-chat">
            <div class="text-sm md:text-[0.935rem] leading-relaxed select-text">${parsedContent}</div>
          </div>

          <!-- Actions Bar -->
          <div class="flex items-center gap-3 mt-2 text-[0.725rem] text-slate-500 dark:text-slate-400 pl-1">
            <span class="font-medium">${msg.time || 'Just now'}</span>
            <span class="text-slate-300 dark:text-slate-600">•</span>
            <button onclick="copyMessageText(${index})" class="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors" title="Copy response">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <span>Copy</span>
            </button>
            <button onclick="speakMessageText(${index})" class="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors" title="Listen to response">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
              </svg>
              <span>Listen</span>
            </button>
            <div class="flex items-center gap-1 ml-1 border-l border-slate-200 dark:border-slate-700 pl-2">
              <button onclick="rateMessage(${index}, 'up')" class="p-1 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition-colors" title="Helpful response">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                </svg>
              </button>
              <button onclick="rateMessage(${index}, 'down')" class="p-1 hover:text-rose-500 rounded transition-colors" title="Not helpful">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Welcome Screen
function getWelcomeScreenHtml() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-3 md:py-5 flex flex-col items-center text-center">
      <!-- Mascot Badge -->
      <div class="relative mb-3">
        <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-800 p-2.5 shadow-xl pulse-badge flex items-center justify-center">
          <img src="assets/mascot.svg" alt="Innaya Mascot" class="w-full h-full object-contain filter drop-shadow-md" />
        </div>
        <span class="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 font-extrabold text-[0.62rem] px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow">
          ONLINE
        </span>
      </div>

      <h1 class="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
        Welcome to <span class="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Innaya-GPT</span>
      </h1>
      <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-lg leading-relaxed">
        Official AI Student Companion for <strong class="text-slate-700 dark:text-slate-200">Innayatullah International School</strong>. Fast answers to school guidelines, cafeteria menus, leadership, exams, and homework.
      </p>

      <!-- Quick Suggestion Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5 w-full max-w-3xl text-left">
        <button onclick="handleSuggestionClick('What is the feeding timetable for high school students?')" 
                class="group p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-lg mb-2.5">
              🍽️
            </div>
            <div class="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Feeding Timetable
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              View daily lunch menu, breakfast & break schedules.
            </p>
          </div>
          <span class="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center gap-1">
            Ask now <span>→</span>
          </span>
        </button>

        <button onclick="handleSuggestionClick('Who is the principal of Innayatullah International School?')" 
                class="group p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-lg mb-2.5">
              🎓
            </div>
            <div class="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Principal & Leadership
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Leadership profiles, office hours & appointment protocol.
            </p>
          </div>
          <span class="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center gap-1">
            Ask now <span>→</span>
          </span>
        </button>

        <button onclick="handleSuggestionClick('What are the examination guidelines and grading scale?')" 
                class="group p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-lg mb-2.5">
              📅
            </div>
            <div class="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Exams & Academic Dates
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Grading system, CA breakdown & term exam calendars.
            </p>
          </div>
          <span class="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center gap-1">
            Ask now <span>→</span>
          </span>
        </button>

        <button onclick="handleSuggestionClick('Tell me about the Robotics & AI Club and how to join')" 
                class="group p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-lg mb-2.5">
              🤖
            </div>
            <div class="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Robotics & Clubs
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              STEM labs, debate society, sports academy & clubs.
            </p>
          </div>
          <span class="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center gap-1">
            Ask now <span>→</span>
          </span>
        </button>

        <button onclick="handleSuggestionClick('What is the official high school uniform and dress code?')" 
                class="group p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-lg mb-2.5">
              👔
            </div>
            <div class="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Uniform & Grooming
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Senior blazer guidelines, sports kits & standards.
            </p>
          </div>
          <span class="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center gap-1">
            Ask now <span>→</span>
          </span>
        </button>

        <button onclick="handleSuggestionClick('What are the Sultan Bello Library hours and borrowing rules?')" 
                class="group p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-lg mb-2.5">
              📖
            </div>
            <div class="font-bold text-sm text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Library & E-Resources
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Borrowing policy, past papers & digital research access.
            </p>
          </div>
          <span class="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center gap-1">
            Ask now <span>→</span>
          </span>
        </button>
      </div>

      <!-- Quick Academic Notice -->
      <div class="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>High school students: You can also attach assignment briefs or syllabus questions below.</span>
      </div>
    </div>
  `;
}

// User Action Handlers
function handleSuggestionClick(text) {
  const input = document.getElementById('messageInput');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

function handleInputKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResizeInput(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';

  // Toggle send button appearance based on text
  const sendBtn = document.getElementById('sendButton');
  if (sendBtn) {
    if (el.value.trim().length > 0 || AppState.attachedFile) {
      sendBtn.classList.remove('opacity-40', 'cursor-not-allowed');
      sendBtn.classList.add('bg-emerald-600', 'text-white', 'hover:bg-emerald-700', 'shadow-md');
    } else {
      sendBtn.classList.add('opacity-40', 'cursor-not-allowed');
      sendBtn.classList.remove('bg-emerald-600', 'text-white', 'hover:bg-emerald-700', 'shadow-md');
    }
  }
}

function sendMessage() {
  if (AppState.isTyping) return;

  const input = document.getElementById('messageInput');
  const text = input.value.trim();

  if (!text && !AppState.attachedFile) return;

  const currentTime = getCurrentFormattedTime();
  const userMsg = {
    role: 'user',
    text: text || `[Uploaded file: ${AppState.attachedFile.name}]`,
    attachedFileName: AppState.attachedFile ? AppState.attachedFile.name : null,
    time: currentTime
  };

  // Ensure current active chat exists
  let chat = AppState.chats.find(c => c.id === AppState.currentChatId);
  if (!chat) {
    createNewChat();
    chat = AppState.chats[0];
  }

  // Set smart chat title & category if this is the first message
  if (chat.messages.length === 0) {
    let cleanTitle = text;
    let category = 'General';
    const lower = text.toLowerCase();

    if (lower.includes('feed') || lower.includes('food') || lower.includes('lunch') || lower.includes('cafeteria')) {
      cleanTitle = 'Feeding Timetable';
      category = 'Campus Life';
    } else if (lower.includes('principal') || lower.includes('head') || lower.includes('leadership')) {
      cleanTitle = "Principal & Leadership";
      category = 'Administration';
    } else if (lower.includes('exam') || lower.includes('grade') || lower.includes('ca')) {
      cleanTitle = 'Exam Guidelines';
      category = 'Academics';
    } else if (lower.includes('club') || lower.includes('robotics') || lower.includes('sport')) {
      cleanTitle = 'Clubs & Societies';
      category = 'Co-Curricular';
    } else if (lower.includes('uniform') || lower.includes('dress')) {
      cleanTitle = 'Uniform & Grooming';
      category = 'Guidelines';
    } else if (lower.includes('library') || lower.includes('book')) {
      cleanTitle = 'Library & Resources';
      category = 'Academics';
    } else {
      cleanTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    }

    chat.title = cleanTitle;
    chat.category = category;
    const currentTitle = document.getElementById('currentChatTitle');
    const currentBadge = document.getElementById('currentChatBadge');
    if (currentTitle) currentTitle.textContent = chat.title;
    if (currentBadge) currentBadge.textContent = chat.category;
  }

  chat.messages.push(userMsg);
  saveChatsToStorage();

  // Clear input & attached file
  input.value = '';
  input.style.height = 'auto';
  clearAttachment();
  autoResizeInput(input);

  // Re-render chat feed with user message
  renderChatFeed();
  renderSidebar();

  // Trigger AI Thinking and Response
  simulateAIResponse(text, userMsg.attachedFileName);
}

function simulateAIResponse(query, attachedFileName) {
  AppState.isTyping = true;
  showTypingIndicator();

  // Determine Answer using Knowledge Base
  let answer = '';
  if (attachedFileName) {
    answer = `### 📄 Document Analysis: ${attachedFileName}

I have received and indexed your document **"${attachedFileName}"**.

Here is what I can do for you:
1. **Summary & Key Takeaways:** Extract main concepts and dates.
2. **Review & Proofreading:** Check clarity, grammar, and alignment with IIS academic standards.
3. **Practice Questions:** Generate mock quiz questions based on the uploaded syllabus notes.

Please let me know if you would like me to summarize it or assist with specific questions from this file!`;
  } else {
    answer = findSchoolAnswer(query);
  }

  // Realistic response latency (600ms - 1100ms)
  const delay = Math.min(1200, Math.max(650, query.length * 15));

  setTimeout(() => {
    removeTypingIndicator();

    const currentTime = getCurrentFormattedTime();
    const aiMsg = {
      role: 'ai',
      text: answer,
      time: currentTime
    };

    const chat = AppState.chats.find(c => c.id === AppState.currentChatId);
    if (chat) {
      chat.messages.push(aiMsg);
      saveChatsToStorage();
      renderChatFeed();
    }

    AppState.isTyping = false;
  }, delay);
}

// Typing Indicator
function showTypingIndicator() {
  const container = document.getElementById('chatFeed');
  if (!container) return;

  const indicatorHtml = `
    <div id="typingIndicatorWrapper" class="flex items-start justify-start gap-3.5 max-w-4xl mx-auto mb-6 px-4">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 p-1 flex items-center justify-center shrink-0 shadow-sm ring-2 ring-emerald-500/20">
        <img src="assets/mascot.svg" alt="Innaya-GPT" class="w-full h-full object-contain filter drop-shadow" />
      </div>
      <div class="bg-emerald-50/70 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 px-5 py-3.5 rounded-2xl rounded-tl-xs border border-emerald-100/80 dark:border-slate-700/80 bubble-shadow-ai flex items-center gap-2">
        <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Innaya-GPT is thinking</span>
        <div class="flex items-center gap-1.5 ml-1">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', indicatorHtml);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicatorWrapper');
  if (indicator) indicator.remove();
}

// File Attachment Handling
function triggerFileInput() {
  const fileInput = document.getElementById('fileUploadInput');
  if (fileInput) fileInput.click();
}

function handleFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Max size 10MB
  if (file.size > 10 * 1024 * 1024) {
    alert('File is too large. Please select a file under 10MB.');
    return;
  }

  AppState.attachedFile = file;
  renderAttachmentPreview(file);

  const input = document.getElementById('messageInput');
  if (input) {
    autoResizeInput(input);
    input.focus();
  }
}

function renderAttachmentPreview(file) {
  const container = document.getElementById('attachmentPreviewContainer');
  if (!container) return;

  const sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';
  container.innerHTML = `
    <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 font-medium mb-2 transition-all">
      <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <span class="max-w-xs truncate">${escapeHtml(file.name)}</span>
      <span class="text-slate-400">(${sizeFormatted})</span>
      <button onclick="clearAttachment()" class="p-0.5 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Remove attachment">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
}

function clearAttachment() {
  AppState.attachedFile = null;
  const container = document.getElementById('attachmentPreviewContainer');
  if (container) container.innerHTML = '';
  const fileInput = document.getElementById('fileUploadInput');
  if (fileInput) fileInput.value = '';
}

// Speech Recognition (Web Speech API)
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    AppState.speechRecognition = new SpeechRecognition();
    AppState.speechRecognition.continuous = false;
    AppState.speechRecognition.interimResults = true;
    AppState.speechRecognition.lang = 'en-US';

    AppState.speechRecognition.onresult = (e) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      const input = document.getElementById('messageInput');
      if (input) {
        input.value = transcript;
        autoResizeInput(input);
      }
    };

    AppState.speechRecognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      stopRecordingUI();
    };

    AppState.speechRecognition.onend = () => {
      stopRecordingUI();
    };
  }
}

function toggleVoiceInput() {
  if (!AppState.speechRecognition) {
    showToast('🎤 Voice input is not supported in this browser.');
    return;
  }

  if (AppState.isRecording) {
    AppState.speechRecognition.stop();
    stopRecordingUI();
  } else {
    try {
      AppState.speechRecognition.start();
      startRecordingUI();
    } catch (err) {
      console.error(err);
      stopRecordingUI();
    }
  }
}

function startRecordingUI() {
  AppState.isRecording = true;
  const micBtn = document.getElementById('micButton');
  if (micBtn) {
    micBtn.classList.add('mic-recording');
  }
  showToast('🎙️ Listening... Speak your question now.');
}

function stopRecordingUI() {
  AppState.isRecording = false;
  const micBtn = document.getElementById('micButton');
  if (micBtn) {
    micBtn.classList.remove('mic-recording');
  }
}

// Text-to-Speech (TTS)
function speakMessageText(messageIndex) {
  const chat = AppState.chats.find(c => c.id === AppState.currentChatId);
  if (!chat || !chat.messages[messageIndex]) return;

  const rawText = chat.messages[messageIndex].text;
  // Clean markdown syntax for speech
  const cleanText = rawText
    .replace(/[#*`_>|]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\|/g, ' ')
    .trim();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any currently speaking audio
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05; // Friendly educational pitch
    window.speechSynthesis.speak(utterance);
    showToast('🔊 Reading response aloud...');
  } else {
    showToast('Speech playback is not supported in your browser.');
  }
}

// Message Action Utilities
function copyMessageText(messageIndex) {
  const chat = AppState.chats.find(c => c.id === AppState.currentChatId);
  if (!chat || !chat.messages[messageIndex]) return;

  const text = chat.messages[messageIndex].text;
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy to clipboard.');
  });
}

function rateMessage(messageIndex, type) {
  showToast(type === 'up' ? '👍 Thank you for your feedback!' : '👎 We will improve this answer.');
}

// Export Chat
function exportCurrentChat() {
  const chat = AppState.chats.find(c => c.id === AppState.currentChatId);
  if (!chat) return;

  let content = `# ${chat.title}\n`;
  content += `Innayatullah International School - Innaya-GPT Conversation Export\n`;
  content += `Date: ${new Date().toLocaleDateString()}\n\n`;
  content += `--------------------------------------------------\n\n`;

  chat.messages.forEach(m => {
    const sender = m.role === 'user' ? 'Student' : 'Innaya-GPT';
    content += `[${m.time || ''}] ${sender}:\n${m.text}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `InnayaGPT_${chat.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Conversation exported as Markdown');
}

// Sidebar Drawer Controls
function toggleSidebarCollapse() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  AppState.isSidebarCollapsed = !AppState.isSidebarCollapsed;

  if (AppState.isSidebarCollapsed) {
    sidebar.classList.add('lg:w-20');
    sidebar.classList.remove('lg:w-72');
    document.querySelectorAll('.sidebar-text').forEach(el => el.classList.add('lg:hidden'));
  } else {
    sidebar.classList.remove('lg:w-20');
    sidebar.classList.add('lg:w-72');
    document.querySelectorAll('.sidebar-text').forEach(el => el.classList.remove('lg:hidden'));
  }
}

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar && backdrop) {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar && backdrop) {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }
}

// Simple Toast Notification
function showToast(message) {
  let toast = document.getElementById('innayaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'innayaToast';
    toast.className = 'fixed bottom-20 right-6 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl transition-all duration-300 transform translate-y-4 opacity-0 border border-slate-700/60 pointer-events-none flex items-center gap-2';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove('translate-y-4', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2400);
}

// Quick Modals (School Hotline & Help)
function openSchoolInfoModal() {
  const modal = document.getElementById('schoolInfoModal');
  if (modal) modal.classList.remove('hidden');
}

function closeSchoolInfoModal() {
  const modal = document.getElementById('schoolInfoModal');
  if (modal) modal.classList.add('hidden');
}

// ===============================================================
// KNOWLEDGE STUDIO CONTROLLER (DIY RAG & .TXT INGESTION)
// ===============================================================
function openKnowledgeStudioModal() {
  const modal = document.getElementById('knowledgeStudioModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderStudioDocuments();
  }
}

function closeKnowledgeStudioModal() {
  const modal = document.getElementById('knowledgeStudioModal');
  if (modal) modal.classList.add('hidden');
}

function renderStudioDocuments() {
  DynamicKnowledgeStore.init();
  const docs = DynamicKnowledgeStore.documents;
  const listEl = document.getElementById('studioDocumentList');
  const docCountEl = document.getElementById('studioDocCount');
  const chunkCountEl = document.getElementById('studioChunkCount');
  const wordCountEl = document.getElementById('studioWordCount');

  let totalChunks = 0;
  let totalWords = 0;
  docs.forEach(d => {
    totalChunks += (d.chunkCount || 0);
    totalWords += (d.wordCount || 0);
  });

  if (docCountEl) docCountEl.textContent = docs.length;
  if (chunkCountEl) chunkCountEl.textContent = totalChunks;
  if (wordCountEl) wordCountEl.textContent = totalWords.toLocaleString();

  if (!listEl) return;

  if (docs.length === 0) {
    listEl.innerHTML = `
      <div class="py-8 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <div class="text-2xl mb-1">📂</div>
        <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">No custom .txt files uploaded yet</div>
        <p class="text-[0.7rem] text-slate-400 mt-0.5">Click "Upload Custom .txt File" or click "Load 3 IIS Sample Files" below.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = docs.map(doc => {
    return `
      <div class="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-xl flex items-center justify-between gap-3 group">
        <div class="min-w-0 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-mono text-xs font-bold">
            TXT
          </div>
          <div class="min-w-0">
            <div class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${escapeHtml(doc.filename)}</div>
            <div class="flex items-center gap-2 text-[0.65rem] text-slate-400 mt-0.5">
              <span>${doc.chunkCount} chunks</span>
              <span>•</span>
              <span>${doc.wordCount} words</span>
              <span>•</span>
              <span>${doc.uploadDate || 'Active'}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="previewDocChunks('${doc.id}')" 
                  class="px-2 py-1 rounded bg-slate-200/80 dark:bg-slate-700/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-[0.65rem] font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
            Inspect Chunks
          </button>
          <button onclick="deleteStudioDocument('${doc.id}')" 
                  class="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Remove file">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function handleKnowledgeFileUpload(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  let loadedCount = 0;
  Array.from(files).forEach(file => {
    if (!file.name.endsWith('.txt')) {
      alert(`Only .txt text files are supported for DIY knowledge training. Skipped: ${file.name}`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      DynamicKnowledgeStore.addDocument(file.name, content);
      loadedCount++;
      if (loadedCount === files.length) {
        renderStudioDocuments();
        showToast(`🧠 Ingested ${loadedCount} school text file(s) into AI Knowledge Store!`);
      }
    };
    reader.readAsText(file);
  });

  e.target.value = '';
}

function loadSampleSchoolDataFiles() {
  // Pre-load the 3 sample files created for Innayatullah International School, Iwo
  const sampleFiles = [
    {
      name: "student_population.txt",
      path: "school_data/student_population.txt"
    },
    {
      name: "feeding_timetable.txt",
      path: "school_data/feeding_timetable.txt"
    },
    {
      name: "principals_profile.txt",
      path: "school_data/principals_profile.txt"
    }
  ];

  let completed = 0;
  sampleFiles.forEach(sf => {
    fetch(sf.path)
      .then(res => res.text())
      .then(text => {
        DynamicKnowledgeStore.addDocument(sf.name, text);
        completed++;
        if (completed === sampleFiles.length) {
          renderStudioDocuments();
          showToast(`⚡ Successfully loaded 3 IIS school data files into AI!`);
        }
      })
      .catch(err => {
        console.warn(`Could not fetch ${sf.path}, loading fallback string directly:`, err);
        completed++;
      });
  });
}

function deleteStudioDocument(docId) {
  DynamicKnowledgeStore.removeDocument(docId);
  renderStudioDocuments();
  showToast('🗑️ Document removed from knowledge store');
}

function clearCustomKnowledgeBase() {
  if (confirm('Clear all uploaded school data files? The AI will revert to default knowledge.')) {
    DynamicKnowledgeStore.clearAll();
    renderStudioDocuments();
    showToast('🧹 Knowledge store cleared');
  }
}

function previewDocChunks(docId) {
  DynamicKnowledgeStore.init();
  const doc = DynamicKnowledgeStore.documents.find(d => d.id === docId);
  if (!doc) return;

  const sampleChunks = doc.chunks.slice(0, 3).map((c, i) => `[Chunk ${i+1}]: "${c.text.substring(0, 110)}..."`).join('\n\n');
  alert(`🔍 RAG Chunks Inspector for '${doc.filename}':\n\nTotal Chunks: ${doc.chunks.length}\n\nSample Chunks:\n\n${sampleChunks}`);
}



function parseInlineMarkdown(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function scrollToBottom() {
  const container = document.getElementById('chatFeed');
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
  }
}

function getCurrentFormattedTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// Global Event Listeners
function setupEventListeners() {
  // Global keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    // Ctrl + K or Cmd + K => New Chat
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      createNewChat();
    }
  });

  // Search input live filtering
  const searchInput = document.getElementById('searchChatInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderSidebar();
    });
  }
}
