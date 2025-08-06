# Cloudflare Worker - Vercel Deployment Scheduler

This Cloudflare Worker automatically triggers Vercel deployments every hour.

## How It Works

- **Cloudflare Workers** run on Cloudflare's edge network (200+ data centers worldwide)
- **Cron Triggers** execute the worker on a schedule (currently every hour)
- When triggered, the worker sends a POST request to Vercel's deploy hook
- No server needed - runs entirely on Cloudflare's infrastructure

## Update the Code

### Option 1: Command Line
```bash
# Make your changes to worker.js
# Then deploy:
npx wrangler deploy
```

### Option 2: Cloudflare Dashboard
1. Go to https://dash.cloudflare.com/a6ef85552aea674cb71a79c86703b801/workers-and-pages
2. Click on "parrabjj-vercel-deployer"
3. Click "Quick edit" to modify code directly in browser
4. Save and deploy

## View Logs & Metrics

Dashboard: https://dash.cloudflare.com/a6ef85552aea674cb71a79c86703b801/workers-and-pages/view/parrabjj-vercel-deployer

## Files

- `worker.js` - Main worker code
- `wrangler.toml` - Configuration (schedule, environment variables)
- `package.json` - Dependencies

## Manual Trigger

Visit: https://parrabjj-vercel-deployer.sfw185.workers.dev/trigger