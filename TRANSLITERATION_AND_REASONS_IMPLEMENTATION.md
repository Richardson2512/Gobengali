# GoBengali - Live Suggestions & Bengali Reasons Implementation

## ✅ Completed Changes

### 1. **Editor Font Changed to Poppins**
- **File**: `frontend/app/globals.css`
- **Change**: Updated `.ProseMirror` class to use Poppins font with Bengali fallback
```css
font-family: 'Poppins', 'Noto Sans Bengali', sans-serif;
```

### 2. **Backend - Bengali Reasons for Errors**
- **File**: `backend/models/model_manager.py`
- **Changes**:
  - Updated `check_spelling()` to return Bengali reasons
  - Updated `check_grammar()` to return Bengali reasons
  - All error responses now include a `reason` field in Bengali

**Example Spelling Errors with Bengali Reasons:**
```python
{
    "wrong": ["তিনশত", "তিনশো"],
    "correct": "তিনশ",
    "reason": "সংখ্যার সঠিক বানান 'তিনশ' হওয়া উচিত।"
}
```

**Example Grammar Errors with Bengali Reasons:**
```python
{
    "wrong": ["ছিল"],
    "correct": "ছিলো",
    "reason": "বহুবচনের জন্য 'ছিলো' ক্রিয়া ব্যবহার করতে হবে।"
}
```

### 3. **Frontend - Bengali Reason Display**
- **File**: `frontend/components/AIAssistantPanel.tsx`
- **Changes**: 
  - Added styled reason display with blue background
  - Shows "কারণ:" (Reason) label in Bengali
  - Reasons displayed in Bengali script with proper typography

### 4. **Transliteration API Endpoint**
- **File**: `backend/api/endpoints/transliteration.py` (NEW)
- **Features**:
  - English to Bengali live transliteration
  - Returns multiple suggestions (default: 4)
  - Ranked by relevance score
  - Supports common words, names, and phonetic patterns

**Example Usage:**
```bash
POST /transliterate
{
  "text": "richard",
  "max_suggestions": 4
}

Response:
{
  "suggestions": [
    {"text": "রিচার্ড", "score": 1.0},
    {"text": "রিসার্ড", "score": 0.9},
    {"text": "রিচার্ডু", "score": 0.8},
    {"text": "রিক্কার্ড", "score": 0.7}
  ]
}
```

### 5. **Frontend API Integration**
- **File**: `frontend/lib/api.ts`
- **Changes**: Added transliteration API function
```typescript
export const transliterate = async (request: TransliterateRequest): Promise<TransliterateResponse>
```

---

## 🚧 Next Steps - Live Dropdown in Editor

To implement the **live dropdown suggestions** feature (like GoTamil), you need to:

### Step 1: Create Suggestion Dropdown Component

Create `frontend/components/TransliterationDropdown.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { transliterate, TransliterationSuggestion } from '@/lib/api';

interface Props {
  position: { top: number; left: number };
  word: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

export function TransliterationDropdown({ position, word, onSelect, onClose }: Props) {
  const [suggestions, setSuggestions] = useState<TransliterationSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const result = await transliterate({ text: word, max_suggestions: 4 });
        setSuggestions(result.suggestions);
      } catch (error) {
        console.error('Transliteration failed:', error);
      }
    };

    if (word.length > 0) {
      fetchSuggestions();
    }
  }, [word]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          onSelect(suggestions[selectedIndex].text);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, onSelect, onClose]);

  if (suggestions.length === 0) return null;

  return (
    <div 
      className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-xl min-w-[200px]"
      style={{ top: position.top, left: position.left }}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`px-4 py-2 cursor-pointer bengali-text text-lg ${
            index === selectedIndex ? 'bg-purple-100 text-purple-900' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelect(suggestion.text)}
        >
          <span className="text-gray-500 text-sm mr-2">{index + 1}.</span>
          {suggestion.text}
        </div>
      ))}
      <div className="px-4 py-2 text-xs text-gray-500 border-t">
        Press Space to select first option
      </div>
    </div>
  );
}
```

### Step 2: Integrate with Editor

Update `frontend/components/Editor.tsx` to detect English words and show suggestions:

```typescript
// Add state for transliteration
const [showTransliteration, setShowTransliteration] = useState(false);
const [currentWord, setCurrentWord] = useState('');
const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

// Add text change handler
useEffect(() => {
  if (!editor) return;

  const handleUpdate = () => {
    const { state } = editor;
    const { from, to } = state.selection;
    
    // Get current word
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, ' ');
    const words = textBefore.split(' ');
    const lastWord = words[words.length - 1];
    
    // Check if it's English text (simple regex)
    if (lastWord && /^[a-zA-Z]+$/.test(lastWord) && lastWord.length > 2) {
      const coords = editor.view.coordsAtPos(from);
      setDropdownPos({ top: coords.bottom + 5, left: coords.left });
      setCurrentWord(lastWord);
      setShowTransliteration(true);
    } else {
      setShowTransliteration(false);
    }
  };

  editor.on('update', handleUpdate);
  editor.on('selectionUpdate', handleUpdate);

  return () => {
    editor.off('update', handleUpdate);
    editor.off('selectionUpdate', handleUpdate);
  };
}, [editor]);

// Add handler to replace word with suggestion
const handleSelectSuggestion = useCallback((suggestion: string) => {
  if (!editor) return;

  const { state } = editor;
  const { from } = state.selection;
  
  // Find the start of the current word
  const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, ' ');
  const words = textBefore.split(' ');
  const lastWord = words[words.length - 1];
  const wordStart = from - lastWord.length;
  
  // Replace the English word with Bengali suggestion
  editor.chain()
    .focus()
    .deleteRange({ from: wordStart, to: from })
    .insertContent(suggestion)
    .run();
  
  setShowTransliteration(false);
}, [editor]);

// Add to JSX
return (
  <div className="relative">
    {/* ... existing code ... */}
    
    {showTransliteration && (
      <TransliterationDropdown
        position={dropdownPos}
        word={currentWord}
        onSelect={handleSelectSuggestion}
        onClose={() => setShowTransliteration(false)}
      />
    )}
  </div>
);
```

### Step 3: Add Toggle Button (Optional)

Add a "বাংলা" (Bengali) toggle button in the toolbar to enable/disable transliteration:

```typescript
const [transliterationEnabled, setTransliterationEnabled] = useState(true);

// In toolbar JSX
<button
  onClick={() => setTransliterationEnabled(!transliterationEnabled)}
  className={`px-3 py-1.5 rounded-lg transition-colors ${
    transliterationEnabled 
      ? 'bg-green-600 text-white' 
      : 'bg-gray-200 text-gray-700'
  }`}
>
  বাংলা
</button>
```

---

## 📊 Testing the Implementation

### Test Backend Changes:

```bash
# Start backend
cd backend
python main_simple.py

# Test transliteration
curl -X POST http://localhost:8000/transliterate \
  -H "Content-Type: application/json" \
  -d '{"text": "richard", "max_suggestions": 4}'

# Test analysis with Bengali reasons
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "আমি তোমাকে তিনশত টাকা দিয়েছিলাম", "check_spelling": true, "check_grammar": true}'
```

### Test Frontend:

1. Start the frontend dev server
2. Type in the editor
3. Errors should now show Bengali reasons
4. Editor should use Poppins font

---

## 🔄 Production Improvements

For production deployment, consider:

### 1. **Better Transliteration Model**
- Use Google's Input Tools API
- Implement AI/Indicanager for better accuracy
- Train custom model on Bengali corpus

### 2. **Caching**
- Cache transliteration results
- Implement Redis for frequently used words
- Reduce API calls

### 3. **Performance**
- Debounce transliteration requests (300ms)
- Implement request cancellation
- Add loading states

### 4. **UX Enhancements**
- Show confidence scores
- Allow users to add custom words
- Remember user preferences
- Offline support with local dictionary

---

## 📝 Summary

✅ **Completed:**
1. Editor font changed to Poppins
2. Backend returns Bengali reasons for all errors
3. AI Assistant displays Bengali reasons beautifully
4. Transliteration API endpoint created
5. Frontend API integration ready

🚧 **To Complete:**
1. Create TransliterationDropdown component
2. Integrate dropdown with Editor
3. Add keyboard navigation (Arrow keys, Enter, Space)
4. Add toggle button for enabling/disabling
5. Test and polish UX

The foundation is complete! The next step is to create the dropdown component and integrate it with the editor to show live suggestions as users type English text.

