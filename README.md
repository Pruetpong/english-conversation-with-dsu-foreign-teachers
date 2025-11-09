# 🎓 English Conversation with DSU Foreign Teachers

<div align="center">

![English Conversation Practice](https://img.shields.io/badge/English-Conversation%20Practice-4F46E5?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-00A67E?style=for-the-badge&logo=openai)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel)

**AI-powered English conversation practice application with realistic foreign teacher personas**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

An interactive web application that simulates English conversation practice with AI-powered foreign teachers from DSU (Dhurakij Pundit University). Practice English in various real-world scenarios with personalized teacher personalities, dual-language support (English-Thai), and voice synthesis.

### 🎯 Purpose

- **For Students**: Practice English conversation with AI teachers in a safe, judgment-free environment
- **For Staff**: Improve professional English communication skills for school contexts
- **For Learners**: Get instant feedback, suggested phrases, and bilingual translations

---

## ✨ Features

### 🧑‍🏫 Four Unique AI Teachers

<table>
<tr>
<td width="25%">

**Teacher Steven**
- 🇺🇸 American
- ⚡ Energetic & Fun
- 🎯 Conversation English, TOEIC
- 🎵 Uses pop culture & music

</td>
<td width="25%">

**Teacher Patrick**
- 🇮🇪 Irish
- 📚 Thoughtful & Patient
- ✍️ Grammar & Writing
- 🎨 Uses color-coding

</td>
<td width="25%">

**Teacher Jerry**
- 🇬🇧 British
- 💼 Professional
- 🎤 Business English, Public Speaking
- 📰 Uses news articles

</td>
<td width="25%">

**Teacher Melaina**
- 🇨🇦 Canadian
- 🎭 Creative & Nurturing
- 📖 Literature, Creative Writing
- 🎨 Uses storytelling

</td>
</tr>
</table>

### 🎬 Eight Conversation Scenarios

| Scenario | Description | Use Case |
|----------|-------------|----------|
| **General Conversation** | ทั่วไป - การสนทนาทั่วไปกับอาจารย์ชาวต่างชาติ | Basic English practice |
| **Classroom Interaction** | ห้องเรียน - การสื่อสารในชั้นเรียน | Asking questions, participating |
| **School Meeting** | การประชุม - การสนทนาในที่ประชุมโรงเรียน | Professional meetings |
| **Parent-Teacher Meeting** | ผู้ปกครอง - การประชุมผู้ปกครอง | Discussing student progress |
| **Cafeteria Conversation** | โรงอาหาร - การสนทนาที่โรงอาหาร | Casual conversations |
| **School Event** | กิจกรรมโรงเรียน - งานกิจกรรม | Event participation |
| **School Office** | สำนักงาน - การติดต่อธุระ | Administrative tasks |
| **Giving Feedback** | การให้ข้อเสนอแนะ - การให้ feedback | Constructive feedback |

### 👥 Two User Modes

- **Student Mode**: Simpler language, more encouraging, focus on confidence building
- **Staff Mode**: Professional language, school-related topics, educational administration

### 🎙️ Core Features

- ✅ **Real-time Streaming Chat** - See responses as they're generated
- ✅ **Dual Language Responses** - English with Thai translations
- ✅ **Voice Synthesis (TTS)** - Hear teacher responses with natural voices
- ✅ **Smart Suggestions** - Get 2-3 suggested replies for each response
- ✅ **Audio Download** - Save teacher audio as MP3 files
- ✅ **Conversation History** - Full chat context maintained
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Dark/Light UI** - Clean, modern interface

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Build tool & dev server
- **Tailwind CSS** - Styling (via CDN)
- **Inter Font** - Typography

### Backend (Serverless)
- **Vercel Serverless Functions** - API endpoints
- **OpenAI API** - LLM & TTS
  - `gpt-4o-mini` - Text generation
  - `tts-1` - Text-to-speech

### APIs & Services
- **OpenAI Chat Completions API** - Streaming chat
- **OpenAI Audio API** - Voice synthesis

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │   React    │  │  TypeScript │  │   Tailwind   │        │
│  │    App     │──│   Components│──│     CSS      │        │
│  └────────────┘  └─────────────┘  └──────────────┘        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ /api/chat (SSE)
                       │ /api/tts (MP3)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Serverless Functions (Node.js)              │  │
│  │  ┌──────────────┐           ┌─────────────────────┐  │  │
│  │  │  /api/chat   │           │     /api/tts        │  │  │
│  │  │              │           │                     │  │  │
│  │  │ • Streaming  │           │ • Voice synthesis   │  │  │
│  │  │ • GPT-4o-mini│           │ • TTS-1 model      │  │  │
│  │  └──────┬───────┘           └────────┬────────────┘  │  │
│  └─────────┼────────────────────────────┼───────────────┘  │
└────────────┼────────────────────────────┼──────────────────┘
             │                             │
             │         OpenAI API          │
             └─────────────┬───────────────┘
                           ↓
            ┌──────────────────────────┐
            │      OpenAI Platform      │
            │  • GPT-4o-mini Model     │
            │  • TTS-1 Model           │
            │  • Streaming Support     │
            └──────────────────────────┘
```

### Component Structure

```
src/
├── App.tsx                    # Main application component
├── components/
│   ├── ChatWindow.tsx        # Message display + audio player
│   ├── MessageInput.tsx      # User input field
│   ├── TeacherSelector.tsx   # Teacher selection cards
│   ├── SettingsPanel.tsx     # Scenario, mode, settings
│   └── icons.tsx            # SVG icon components
├── services/
│   └── openaiService.ts     # API calls to /api/* endpoints
├── types.ts                 # TypeScript interfaces
├── constants.ts             # Teachers, scenarios, modes data
└── index.tsx               # React entry point
```

### Data Flow

```
User Input → App.tsx → /api/chat → OpenAI GPT-4o-mini
                 ↓                          ↓
            Stream chunks ← ← ← ← ← ← ← ← ←
                 ↓
         Parse suggestions
                 ↓
         Extract English text
                 ↓
         /api/tts → OpenAI TTS-1
                 ↓
         MP3 Audio → Auto-play + Download
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pruetpong/english-conversation-with-dsu-foreign-teachers.git
   cd english-conversation-with-dsu-foreign-teachers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local`:
   ```env
   OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pruetpong/english-conversation-with-dsu-foreign-teachers)

#### Manual Deploy

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Framework: **Vite** (auto-detected)

3. **Set Environment Variable**
   - Add `OPENAI_API_KEY` in Vercel dashboard
   - Value: Your OpenAI API key

4. **Deploy**
   - Click **Deploy**
   - Wait 1-2 minutes
   - Done! 🎉

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📚 Documentation

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for GPT & TTS | ✅ Yes | - |

### API Endpoints

#### POST `/api/chat`

Streaming chat completions endpoint.

**Request:**
```json
{
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "Hello"}
  ],
  "temperature": 0.7,
  "maxTokens": 800
}
```

**Response:** Server-Sent Events (SSE)
```
data: {"content":"Hello"}
data: {"content":" there"}
data: [DONE]
```

#### POST `/api/tts`

Text-to-speech generation endpoint.

**Request:**
```json
{
  "text": "Hello, how are you?",
  "voice": "onyx"
}
```

**Response:** `audio/mpeg` (MP3 binary)

### Teacher Voice Profiles

| Teacher | Voice | Gender | Characteristics |
|---------|-------|--------|----------------|
| Steven | `onyx` | Male | Deep, energetic |
| Patrick | `echo` | Male | Thoughtful, clear |
| Jerry | `fable` | Male | Professional, British-ish |
| Melaina | `nova` | Female | Warm, creative |

**Available OpenAI voices**: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`

---

## 🎨 Features Deep Dive

### Dual Language System

Every teacher response includes:
1. **English Response** - Native English from AI teacher
2. **Suggested Phrases** - 2-3 relevant follow-up phrases
3. **Thai Translation** - Accurate translation for Thai learners
4. **Gender-appropriate particles** - ครับ (male) / ค่ะ (female)

**Example Response:**
```
Hello! How are you today? What brings you here?

Suggested phrases:
1. I'm doing well, thank you
2. I need help with my English homework
3. I want to improve my speaking skills

---

สวัสดีครับ วันนี้เป็นอย่างไรบ้างครับ มีอะไรให้ช่วยไหมครับ
```

### Smart Conversation Context

The app maintains full conversation history:
- ✅ Remembers previous messages
- ✅ Contextual responses
- ✅ Natural conversation flow
- ✅ Teacher stays in character

### Audio Features

**Text-to-Speech:**
- ✅ Auto-play after response (optional)
- ✅ Natural voice per teacher
- ✅ Download as MP3
- ✅ 24kHz quality audio

### Responsive Design

- 📱 **Mobile**: Slide-out settings panel
- 💻 **Desktop**: Side-by-side layout
- 📺 **Tablet**: Optimized spacing

---

## 🧪 Testing

### Test Chat API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7
  }'
```

### Test TTS API

```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "voice": "onyx"
  }' \
  --output test.mp3
```

---

## 🔒 Security

### API Key Protection

- ✅ **Never exposed to client** - API key stored in Vercel environment variables
- ✅ **Server-side only** - All OpenAI calls from serverless functions
- ✅ **No client-side secrets** - Frontend only calls proxy endpoints

### Best Practices

- 🔐 Use environment variables for secrets
- 🚫 Never commit `.env.local` to Git
- ✅ Enable CORS only for trusted domains (production)
- ✅ Implement rate limiting (if needed)

---

## 💰 Cost Estimation

### OpenAI API Pricing

| Service | Model | Cost | Example |
|---------|-------|------|---------|
| Chat | `gpt-4o-mini` | $0.15/1M input tokens<br>$0.60/1M output tokens | 1,000 conversations ≈ $2-5 |
| TTS | `tts-1` | $15/1M characters | 1,000 audio generations ≈ $3-5 |

**Monthly estimate** for 1,000 conversations with audio: **~$5-10 USD**

### Vercel Pricing

**Free Tier Includes:**
- ✅ 100 GB Bandwidth
- ✅ 100 GB-Hrs Serverless Function Execution
- ✅ Unlimited deployments

---

## 🛣️ Roadmap

### Current Features ✅
- [x] Four AI teachers with unique personalities
- [x] Eight conversation scenarios
- [x] Dual language support (EN-TH)
- [x] Text-to-speech with voice synthesis
- [x] Smart phrase suggestions
- [x] Real-time streaming responses
- [x] Mobile responsive design
- [x] Vercel deployment ready

### Planned Features 🚧
- [ ] Conversation history persistence
- [ ] User accounts & progress tracking
- [ ] Speech-to-text input
- [ ] Vocabulary builder
- [ ] Grammar correction highlights
- [ ] Achievement system
- [ ] More teachers and languages
- [ ] Custom scenarios

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is created for educational purposes at Dhurakij Pundit University.

---

## 👨‍💻 Author

**Developed for DSU** (Dhurakij Pundit University)

---

## 🙏 Acknowledgments

- **OpenAI** - For GPT-4o-mini and TTS APIs
- **Vercel** - For serverless hosting platform
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework

---

## 📞 Support

For issues and questions:

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review [existing issues](https://github.com/Pruetpong/english-conversation-with-dsu-foreign-teachers/issues)
3. Create a new issue if needed

---

## 📸 Screenshots

### Desktop View
```
┌─────────────────────────────────────────────────────────────────┐
│  Settings Panel  │          Chat Window                         │
│                  │                                               │
│  [Teachers]      │  Teacher Steven: Hello! How are you?        │
│  • Steven ✓      │  Suggested: I'm fine / I need help          │
│  • Patrick       │  User: I'm fine, thank you                  │
│  • Jerry         │  Teacher Steven: Great to hear!             │
│  • Melaina       │                                               │
│                  │  [Type your message...]                      │
│  [Scenarios]     │                                               │
│  [Settings]      │                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for English learners at DSU

</div>
