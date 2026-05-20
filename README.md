# AIMAR Command Deck

> Operational Intelligence Infrastructure — Interactive Web Presentation

A premium command-center demo for AIMAR Systems Group.  
Built to deploy at `deck.aimar.store` via Vercel + Namecheap.

---

## Local Development

```bash
npm install
npm run dev          # → http://localhost:5173
```

### Optional: Live AI Features

The app ships in **DEMO MODE** by default (deterministic mock responses for all AI interactions).  
To enable the live Gemini AI integration:

1. Get a Gemini API key at [aistudio.google.com](https://aistudio.google.com)
2. Copy the env file: `cp .env.example .env.local`
3. Add your key: `VITE_GEMINI_API_KEY=your_key_here`
4. Restart the dev server

**Never commit `.env.local` — your key must stay out of git.**

---

## Deploy to Vercel (Recommended)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "init: AIMAR Command Deck V9"
git remote add origin https://github.com/YOUR_USERNAME/aimar-command-deck.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework Preset: **Vite** (auto-detected)
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Step 3 — Add Environment Variable (if using live AI)

In Vercel: **Project → Settings → Environment Variables**

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_GEMINI_API_KEY` | `your_key` | Production, Preview |

### Step 4 — Add Custom Domain in Vercel

1. Vercel → Project → **Settings → Domains**
2. Add `deck.aimar.store`
3. Vercel gives you DNS records — copy them

---

## Namecheap DNS Configuration

Go to **Namecheap → Domain List → aimar.store → Manage → Advanced DNS**

Add these records (Vercel provides the exact IP/CNAME values in step 4 above):

| Host | Type | Value | TTL |
|------|------|-------|-----|
| `@` | A | `76.76.21.21` *(Vercel IP — verify in Vercel dashboard)* | Automatic |
| `www` | CNAME | `cname.vercel-dns.com` | Automatic |
| `deck` | CNAME | `cname.vercel-dns.com` | Automatic |

> ⚠️ **Do NOT touch MX records** — your `ari@aimar.store` email will break.  
> Only add the A / CNAME rows above.

DNS propagation: 5–30 min (usually faster with Namecheap).

### Verify

```bash
# Check propagation
dig deck.aimar.store CNAME
# or
nslookup deck.aimar.store
```

---

## Domain Architecture

```
aimar.store          →  Main landing page (future)
deck.aimar.store     →  This interactive command deck
lab.aimar.store      →  Markets Lab / experiments (future)
ari@aimar.store      →  Contact (do not touch MX records)
```

---

## Alternative: Netlify

```bash
npm run build
# Drag and drop the /dist folder to app.netlify.com/drop
# Then: Site settings → Domain management → Add custom domain → deck.aimar.store
# Netlify gives you a CNAME: add it as host `deck` in Namecheap Advanced DNS
```

---

## Tech Stack

- **React 18** + **Vite** — fast, zero-config build
- **Tailwind CSS v3** — utility-first styling
- **Lucide React** — icon system
- **Gemini API** (optional) — live AI for ODSM threat analysis + workflow synthesis

---

## Navigation

| Action | Control |
|--------|---------|
| Next slide | `→` arrow key or Space |
| Previous slide | `←` arrow key |
| Jump to slide | Click sidebar index |

---

## Project Structure

```
aimar-command-deck/
├── src/
│   ├── App.jsx          # All slides + AI integration
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind + global styles
├── public/
│   └── favicon.svg
├── index.html
├── vercel.json          # SPA routing + security headers
├── .env.example         # Template for environment variables
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

*AIMAR Systems Group — Operational Intelligence Infrastructure*
