# SellGenie 🧞‍♂️

SellGenie is an advanced AI-powered sales copilot designed to help modern B2B sales teams close deals faster. By securely uploading your organization's sales playbooks, competitor battlecards, and past proposals, SellGenie provides your sales reps with an intelligent chat interface to instantly generate proposals, compare competitors, handle objections, and prepare for meetings.

## 🚀 Features

- **Multi-Tenant Architecture:** Securely isolate data using Organizations. Users join a specific organization and only interact with their team's data.
- **Intelligent Document Ingestion:** Upload PDFs, DOCX files, and text documents. SellGenie automatically chunks and vectorizes your documents for semantic search.
- **AI Sales Copilot:** A sleek, ChatGPT-like interface where sales reps can ask questions and get answers grounded strictly in your organization's uploaded documents.
- **Pre-Built Sales Tools:** One-click shortcuts for generating proposals, comparing competitors, extracting key points, and handling objections.
- **Secure Authentication:** Full authentication flow using NextAuth (Credentials & Google OAuth) with edge middleware protection for private routes.
- **Beautiful Dark UI:** Premium, modern UI built with Tailwind CSS, Framer Motion, and Lucide Icons.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Database:** PostgreSQL (with [Prisma ORM](https://www.prisma.io/))
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **AI & RAG:** [Vercel AI SDK](https://sdk.vercel.ai/docs), [LangChain](https://js.langchain.com/docs/), and Vector Database for Retrieval-Augmented Generation.
- **Validation:** [Zod](https://zod.dev/)

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine. You will also need a PostgreSQL database (local or hosted, e.g., Supabase or Neon) and your LLM / Vector DB credentials.

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/sellgenie.git
cd sellgenie
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add the following keys. 

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sellgenie"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI & Vector DB 
OPENAI_API_KEY="sk-..."
# Add your Vector DB keys here (e.g., Qdrant, Pinecone)
```

### 3. Database Setup
Push the Prisma schema to your database to create the necessary tables:
```bash
npx prisma db push
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the landing page.

## 📁 Project Structure

- `/src/app`: Next.js App Router pages (Dashboard, Auth, Landing).
- `/src/app/api`: API routes for authentication, AI chat streaming, and document ingestion.
- `/src/sections`: Reusable UI sections for the landing page (Hero, Features, Footer).
- `/src/lib`: Core utilities (Prisma client, chunking logic, LLM helpers).
- `/prisma`: Database schema and migration files.

## 🛡️ Authentication & Middleware

SellGenie uses `next-auth/middleware` to protect sensitive routes. 
- `/dashboard/*` and `/onboarding/*` require an active session.
- If an authenticated user attempts to visit the landing page or login pages, they are securely redirected to the dashboard.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
