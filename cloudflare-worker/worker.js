export default {
  async scheduled(event, env, ctx) {
    console.log(`Cron trigger executed at ${new Date().toISOString()}`);
    
    // Trigger Vercel deployment
    const response = await fetch(env.VERCEL_DEPLOY_HOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      console.log('Successfully triggered Vercel deployment');
      return new Response('Deployment triggered', { status: 200 });
    } else {
      console.error(`Failed to trigger deployment: ${response.status}`);
      throw new Error(`Deployment failed with status: ${response.status}`);
    }
  },

  // Optional: Add a manual trigger endpoint
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response('Worker is healthy', { status: 200 });
    }
    
    // Manual trigger endpoint (protected by secret)
    if (url.pathname === '/trigger') {
      const authHeader = request.headers.get('Authorization');
      
      // Check for simple auth token (optional)
      if (env.TRIGGER_SECRET && authHeader !== `Bearer ${env.TRIGGER_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      try {
        const response = await fetch(env.VERCEL_DEPLOY_HOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          return new Response('Deployment triggered successfully', { status: 200 });
        } else {
          return new Response(`Failed to trigger deployment: ${response.status}`, { 
            status: response.status 
          });
        }
      } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
    }
    
    return new Response('Not Found', { status: 404 });
  },
};