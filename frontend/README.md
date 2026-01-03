Next.js + TypeScript frontend for GoBengali Bangla writing assistant.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles + TipTap styles
│
├── components/
│   ├── Header.tsx          # Top navigation bar
│   ├── Editor.tsx          # Main TipTap editor with corrections
│   ├── AIAssistantPanel.tsx # Sidebar with issues and suggestions
│   ├── SuggestionDropdown.tsx # Inline suggestion popup
│   ├── ExportModal.tsx     # Export dialog (TXT/DOCX/PDF)
│   └── ui/
│       └── Button.tsx      # Reusable button component
│
├── store/
│   └── editorStore.ts      # Zustand global state management
│
├── lib/
│   ├── api.ts              # API client with all endpoints
│   └── utils.ts            # Utility functions
│
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # TailwindCSS configuration
├── next.config.js          # Next.js configuration
└── .env.local              # Environment variables
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=GoBengali
NEXT_PUBLIC_MAX_FREE_WORDS=1000
```

## 🎨 Key Features

### TipTap Editor
- Rich text editing with ProseMirror
- Inline error highlighting
- Custom Bangla font support (Noto Sans Bengali)
- Real-time word/character counting

### AI Assistant Panel
- Categorized error display (Spelling, Grammar, Translation)
- Interactive suggestions
- Apply all corrections at once
- Detailed error explanations

### Export System
- Export to TXT (plain text)
- Export to DOCX (Microsoft Word)
- Export to PDF (with Bangla fonts)

### State Management
- Zustand for global state
- Efficient re-renders
- Type-safe state updates

## 🧩 Components

### Editor.tsx
Main text editor with:
- TipTap integration
- Error highlighting (red for spelling, yellow for grammar)
- Suggestion dropdown on click
- Translation and analysis triggers

### AIAssistantPanel.tsx
Sidebar panel showing:
- All detected errors grouped by type
- Suggestions for each error
- Apply/Ignore actions
- Progress counter

### SuggestionDropdown.tsx
Contextual popup showing:
- Error type and message
- Multiple suggestions
- Apply or ignore options

### Header.tsx
Top navigation with:
- Logo and branding
- Word/character count
- User tier indicator
- Export and settings buttons

### ExportModal.tsx
Export dialog with:
- Multiple format options
- File download handling
- Bangla font preservation

## 📡 API Integration

### API Client (`lib/api.ts`)

```typescript
// Analyze text (translation + corrections)
const result = await analyzeText({
  text: "Hello World",
  check_grammar: true,
  check_spelling: true
});

// Translate only
const translation = await translateText({
  text: "Hello",
  target_lang: "ben_Beng"
});

// Detect language
const detected = await detectLanguage({
  text: "Hello World"
});
```

## 🎨 Styling

### TailwindCSS
- Utility-first CSS framework
- Custom color scheme for Bangla aesthetics
- Responsive design
- Dark mode ready

### Custom Styles
- Bangla font loading (Noto Sans Bengali)
- Error underlines (wavy red/yellow)
- Smooth animations
- Accessible design

## 🔄 State Management

### Zustand Store

```typescript
// Access state
const { content, errors, isPanelOpen } = useEditorStore();

// Update state
setContent(newContent);
setErrors(detectedErrors);
togglePanel();

// Apply suggestion
applySuggestion(errorId, suggestion);
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Your backend API URL

### Netlify

```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

## 🐛 Troubleshooting

### Common Issues

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**API connection failed:**
- Check backend is running on port 8000
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check CORS settings in backend

**TipTap editor not loading:**
- Check dynamic import in page.tsx
- Clear .next cache: `rm -rf .next`

## 📚 Dependencies

### Core
- `next`: 14.2.0
- `react`: 18.3.0
- `typescript`: 5.3.0

### Editor
- `@tiptap/react`: 2.3.0
- `@tiptap/starter-kit`: 2.3.0
- `@tiptap/extension-underline`: 2.3.0
- `@tiptap/extension-highlight`: 2.3.0

### State & HTTP
- `zustand`: 4.5.0
- `axios`: 1.7.0

### UI
- `tailwindcss`: 3.4.0
- `framer-motion`: 11.0.0
- `lucide-react`: 0.363.0

### Export
- `file-saver`: 2.0.5
- `docx`: 8.5.0
- `jspdf`: 2.5.1

## 🔗 Related Documentation

- [Main README](../README.md)
- [Backend README](../backend/README.md)
- [API Documentation](http://localhost:8000/docs)

---

**Built with Next.js and TypeScript**

