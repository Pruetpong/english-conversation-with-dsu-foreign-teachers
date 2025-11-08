# 🚀 Deployment Guide - Vercel

คู่มือการ deploy แอปพลิเคชัน English Conversation with DSU Foreign Teachers บน Vercel

## 📋 สิ่งที่ต้องเตรียม

1. **Vercel Account** - สมัครที่ [vercel.com](https://vercel.com)
2. **OpenAI API Key** - สร้างได้ที่ [platform.openai.com](https://platform.openai.com/api-keys)
3. **GitHub Repository** - push โค้ดขึ้น GitHub

---

## 🔧 ขั้นตอนการ Deploy

### **Option 1: Deploy ผ่าน Vercel Dashboard (แนะนำ)**

#### 1. เชื่อมต่อ GitHub กับ Vercel

1. ไปที่ [vercel.com/new](https://vercel.com/new)
2. เลือก **Import Git Repository**
3. เลือก repository: `english-conversation-with-dsu-foreign-teachers`
4. คลิก **Import**

#### 2. ตั้งค่า Project

- **Framework Preset**: Vite (ควรจะ detect อัตโนมัติ)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)

#### 3. ตั้งค่า Environment Variables

ใน **Environment Variables** section:

```
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

**สำคัญ:** ต้องตั้งค่า Environment Variable ชื่อ `OPENAI_API_KEY`

#### 4. Deploy

1. คลิก **Deploy**
2. รอ 1-2 นาที
3. เสร็จแล้ว! 🎉

---

### **Option 2: Deploy ผ่าน Vercel CLI**

#### 1. ติดตั้ง Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 4. ตั้งค่า Environment Variable

```bash
vercel env add OPENAI_API_KEY
```

จากนั้นใส่ API key เมื่อ prompt ถาม

---

## 🔒 การตั้งค่า Environment Variables

### ใน Vercel Dashboard:

1. ไปที่ Project Settings
2. เลือก **Environment Variables**
3. เพิ่ม variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-...`
   - **Environment**: Production, Preview, Development (เลือกทั้งหมด)
4. คลิก **Save**

### Redeploy หลังเพิ่ม Environment Variable:

1. ไปที่ **Deployments** tab
2. เลือก deployment ล่าสุด
3. คลิก **⋯** (three dots) → **Redeploy**

---

## 🏗️ โครงสร้าง Serverless Functions

แอปพลิเคชันใช้ Vercel Serverless Functions:

```
/api
├── chat.js    - POST /api/chat (Streaming chat completions)
└── tts.js     - POST /api/tts (Text-to-speech generation)
```

**API Endpoints:**

- `https://your-app.vercel.app/api/chat`
- `https://your-app.vercel.app/api/tts`

---

## 🧪 ทดสอบ Deployment

### ทดสอบผ่าน Browser

1. เปิด `https://your-app.vercel.app`
2. ลองสนทนากับครู
3. ทดสอบเสียงพูด (TTS)

### ทดสอบ API โดยตรง

```bash
# Test Chat API
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7
  }'

# Test TTS API
curl -X POST https://your-app.vercel.app/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "voice": "onyx"
  }' \
  --output test.mp3
```

---

## 📊 การ Monitor และ Logs

### ดู Logs

1. ไปที่ Vercel Dashboard
2. เลือก project
3. คลิก **Functions** tab
4. เลือก function ที่ต้องการดู logs

### ตรวจสอบ Usage

1. ไปที่ **Settings** → **Usage**
2. ดู Function Executions และ Bandwidth

---

## ⚡ Performance Optimization

### 1. Edge Functions (Optional)

หาก traffic สูง สามารถอัปเกรดเป็น Edge Functions:

```javascript
// api/chat.js
export const config = {
  runtime: 'edge',
};
```

### 2. Caching

เพิ่ม caching headers ใน `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🐛 Troubleshooting

### ❌ API Error: Failed to generate response

**สาเหตุ:** ไม่พบ Environment Variable `OPENAI_API_KEY`

**แก้ไข:**
1. ตรวจสอบว่าตั้งค่า Environment Variable แล้ว
2. Redeploy project

### ❌ 504 Gateway Timeout

**สาเหตุ:** Function timeout (Vercel default: 10s)

**แก้ไข:** อัปเกรด Vercel plan หรือเพิ่ม timeout ใน `vercel.json`:

```json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 60
    }
  }
}
```

### ❌ CORS Error

**สาเหตุ:** CORS headers ไม่ถูกต้อง

**แก้ไข:** ตรวจสอบ `vercel.json` ว่ามี CORS headers

---

## 💰 Cost Estimation

### Vercel (Free Tier)

- ✅ 100 GB Bandwidth
- ✅ 100 GB-Hrs Serverless Function Execution
- ✅ Unlimited deployments

### OpenAI API Costs

- **GPT-4o-mini**: ~$0.15/1M input tokens, ~$0.60/1M output tokens
- **TTS-1**: ~$15/1M characters

**ประมาณการ:** 1,000 conversations/month = ~$5-10

---

## 🔄 การ Update Code

### Update ผ่าน Git

```bash
# Make changes
git add .
git commit -m "Update: your changes"
git push origin main
```

Vercel จะ auto-deploy เมื่อ push ไป main branch

### Manual Redeploy

```bash
vercel --prod
```

---

## 📞 Support

หากมีปัญหา:

1. ดู [Vercel Documentation](https://vercel.com/docs)
2. ตรวจสอบ Logs ใน Vercel Dashboard
3. ลอง redeploy project

---

## ✅ Checklist ก่อน Deploy

- [ ] Push code ขึ้น GitHub
- [ ] มี OpenAI API key
- [ ] สร้าง Vercel account
- [ ] Import repository to Vercel
- [ ] ตั้งค่า `OPENAI_API_KEY` environment variable
- [ ] Deploy และทดสอบ
- [ ] ตรวจสอบ API endpoints ทำงานปกติ
- [ ] ทดสอบ TTS และ Chat features

---

**ขอให้ deploy สำเร็จ! 🚀**
