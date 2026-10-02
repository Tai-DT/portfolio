<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=soft&color=0:0d1117,100:00d2ff&height=150&section=header&text=⚡%20Tài%20Đỗ%20(Kai)%20•%20taido.dev&fontSize=34&fontColor=ffffff&animation=twinkling&fontAlignY=50"/>

# 🌐 [taido.dev](https://taido.dev)

**Full-Stack Developer & AI Systems Engineer Portfolio**  
*Built with Next.js 15, React 19, Hono Web Framework & 100% Cloudflare Native Stack: Pages, Workers, D1 SQL, R2 Storage & Workers AI.*

[![Live Site](https://img.shields.io/badge/🔴_LIVE-taido.dev-00d2ff?style=for-the-badge)](https://taido.dev)
[![Hono](https://img.shields.io/badge/Hono_v4-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1-SQL_Database-orange?style=for-the-badge&logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-Object_Storage-F38020?style=for-the-badge&logo=cloudflare)](https://developers.cloudflare.com/r2/)
[![Cloudflare AI](https://img.shields.io/badge/Workers_AI-Llama_3.1-blueviolet?style=for-the-badge&logo=cloudflare)](https://developers.cloudflare.com/workers-ai/)

</div>

---

## ✨ Features & Cloudflare Native Architecture

| Feature | Description |
|:-------:|:------------|
| ⚡ **Hono v4 Backend** | Ultra-fast, lightweight web API running at Cloudflare Edge (`/api/*`) |
| 🤖 **Cloudflare Workers AI** | Built-in **Kai AI Assistant** powered by Meta Llama 3.1 running on Cloudflare GPUs |
| 🗄️ **Cloudflare D1 Database** | Serverless SQLite SQL database powering the live Guestbook & Contact inquiries |
| 📦 **Cloudflare R2 Storage** | Zero-egress object storage for serving CV/Resumes and portfolio assets |
| 🎨 **Dynamic Theming** | 24-hour living color scheme shifting based on time of day and local weather |
| 🧊 **3D Interactive Scene** | Three.js powered 3D Bumblebee companion tracking section navigation & mouse physics |
| 📱 **Responsive & Accessible** | Built with Radix UI, Tailwind CSS v4, and mobile-optimized layouts |
| 🔒 **Custom Domain Ready** | Configured for `taido.dev` on Cloudflare with SSL and global CDN caching |

---

## 🛠️ Full-Stack Technology Stack

| Layer | Technologies |
|:-----:|:-------------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Radix UI |
| **Backend Framework** | **Hono v4** mounted on Next.js Edge & Cloudflare Pages Functions |
| **Database** | **Cloudflare D1** (Serverless Distributed SQL Database) |
| **Object Storage** | **Cloudflare R2** (`taido-portfolio-assets` for CV and media) |
| **AI Inference** | **Cloudflare Workers AI** (`@cf/meta/llama-3.1-8b-instruct`) |
| **3D & Graphics** | Three.js, React Three Fiber (R3F), GLTF Model Loader |
| **Hosting & DNS** | Cloudflare Pages, Cloudflare Workers, Custom Domain `taido.dev` |

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/Tai-DT/portfolio.git
cd portfolio

# Install dependencies (handling React 19 peer dependencies)
npm install --legacy-peer-deps

# Start development server with Turbopack ⚡
npm run dev

# Build and verify for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio locally.

---

## ☁️ Cloudflare Setup & Deployment (`taido.dev`)

### Step 1: Login & Initialize Cloudflare Resources

```bash
# 1. Login to your Cloudflare account
npx wrangler login

# 2. Create the Cloudflare D1 SQL database
npm run d1:create
# Output will display your database_id

# 3. Create the Cloudflare R2 object storage bucket
npm run r2:create
```

*Update `database_id` inside `wrangler.jsonc` if needed.*

### Step 2: Apply D1 Database Migrations

Apply the database schema (`contact_messages`, `guestbook_entries`, `page_views`):

```bash
# Apply schema to local development D1 (optional)
npm run d1:migrate:local

# Apply schema to production Cloudflare D1
npm run d1:migrate
```

### Step 3: Deploy to Cloudflare Pages & Connect `taido.dev`

#### Option A: Cloudflare Dashboard (Recommended)
1. Go to **Cloudflare Dashboard** → **Compute (Workers & Pages)** → **Create application** → **Pages** → **Connect to Git**.
2. Select your repository `Tai-DT/portfolio`.
3. Configure build settings:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
4. In **Settings** → **Functions**:
   - **D1 Database Bindings**:
     - Variable name: `DB` → Select `taido-portfolio-db`
   - **R2 Bucket Bindings**:
     - Variable name: `R2_BUCKET` → Select `taido-portfolio-assets`
   - **Workers AI Bindings**:
     - Variable name: `AI` (Enable Workers AI)
5. In **Custom domains**:
   - Click **Set up a custom domain**
   - Enter `taido.dev` (and `www.taido.dev`)
   - Cloudflare will automatically provision SSL certificates and update DNS!

#### Option B: Direct CLI Deployment
```bash
npm run deploy:cloudflare
```

---

## 📡 API Endpoints (Hono Edge)

- `GET /api/stats`: Live edge status (D1, R2, Workers AI, edge PoP region, GitHub stats)
- `GET /api/health`: Healthcheck endpoint
- `POST /api/contact`: Send inquiry to Cloudflare D1
- `GET /api/guestbook`: Fetch recent guestbook entries from Cloudflare D1
- `POST /api/guestbook`: Submit new guestbook entry to Cloudflare D1
- `POST /api/ai/chat`: Interactive chat powered by **Cloudflare Workers AI (Llama 3.1)**
- `GET /api/r2/files`: List assets in **Cloudflare R2**
- `GET /api/r2/file/:key`: Stream asset from **Cloudflare R2** (e.g. CV download)
- `POST /api/r2/upload`: Upload file to **Cloudflare R2**

---

## 👨‍💻 Developer Profile

- **Name**: Tài Đỗ (Kai)
- **GitHub**: [@Tai-DT](https://github.com/Tai-DT)
- **Domain**: [taido.dev](https://taido.dev)
- **Specialization**: Model Context Protocol (MCP), Full-Stack Systems, Native Apple & Mobile Apps
