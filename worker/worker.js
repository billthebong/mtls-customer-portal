import { SignJWT, jwtVerify } from 'jose';

// Modern Cloudflare Worker structure
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};

async function handleRequest(request, env) {
  // Access environment variables properly
  const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4';
  const ACCOUNT_ID = env.ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN;
  const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

  // Ensure environment variables are configured
  if (!ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !env.CERTIFICATES_KV) {
    return new Response(JSON.stringify({
      error: "Configuration error",
      details: "Required environment variables are missing",
      missing: {
        ACCOUNT_ID: !env.ACCOUNT_ID,
        CLOUDFLARE_API_TOKEN: !env.CLOUDFLARE_API_TOKEN,
        CERTIFICATES_KV: !env.CERTIFICATES_KV
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers (updated for production)
  const corsHeaders = {
    'Access-Control-Allow-Origin': ' https://customer-portal-worker.bradford-jardine.workers.dev',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Login endpoint
  if (path === '/api/login' && request.method === 'POST') {
    try {
      const { username, password } = await request.json();
      if (username === 'customer' && password === 'securepassword') {
        const token = await new SignJWT({ username, id: 'customer_id' })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('1h')
          .sign(JWT_SECRET);
        return new Response(JSON.stringify({ token }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Login error', details: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // Certificate generation endpoint
  if (path === '/api/certificates' && request.method === 'POST') {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Invalid or missing Authorization header' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const token = authHeader.slice(7).trim();
    console.log('Received token:', token);
    if (!token) return new Response(JSON.stringify({ error: 'Empty token' }), { status: 401, headers: corsHeaders });

    try {
      await jwtVerify(token, JWT_SECRET);

      console.log('Generating client certificate...');
      const response = await fetch(`${CLOUDFLARE_API_URL}/accounts/${ACCOUNT_ID}/client_certificates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          private_key_type: 'RSA',
          validity_period: 365,
        }),
      });

      const data = await response.json();
      console.log('Certificate API response status:', response.status);

      if (!data.success) {
        const errorMsg = data.errors?.[0]?.message || `API error: ${response.status}`;
        console.error('Certificate generation failed:', errorMsg);
        throw new Error(errorMsg);
      }

      const { id, certificate, private_key } = data.result;
      const downloadToken = crypto.randomUUID();

      await env.CERTIFICATES_KV.put(downloadToken, JSON.stringify({
        certificate,
        private_key
      }), {
        expirationTtl: 3600
      });

      return new Response(JSON.stringify({ certificateId: id, downloadToken }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      console.error('Certificate generation error:', err.message);
      return new Response(JSON.stringify({
        error: 'Failed to generate certificate',
        details: err.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // Certificate download endpoint
  if (path.startsWith('/api/certificates/download/') && request.method === 'GET') {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Invalid or missing Authorization header' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const token = authHeader.slice(7).trim();
    console.log('Received token:', token);
    if (!token) return new Response(JSON.stringify({ error: 'Empty token' }), { status: 401, headers: corsHeaders });

    try {
      await jwtVerify(token, JWT_SECRET);
      const downloadToken = path.split('/').pop();

      const data = await env.CERTIFICATES_KV.get(downloadToken, 'json');
      if (!data) {
        return new Response(JSON.stringify({ error: 'Invalid or expired download link' }), {
          status: 404,
          headers: corsHeaders
        });
      }

      await env.CERTIFICATES_KV.delete(downloadToken);

      return new Response(data.certificate, {
        headers: {
          'Content-Disposition': 'attachment; filename=certificate.pem',
          'Content-Type': 'application/x-pem-file',
          ...corsHeaders,
        },
      });
    } catch (err) {
      console.error('Certificate download error:', err.message);
      return new Response(JSON.stringify({
        error: 'Failed to download certificate',
        details: err.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // Testing endpoint to check environment variables
  if (path === '/api/debug' && request.method === 'GET') {
    return new Response(JSON.stringify({
      status: 'ok',
      env: {
        hasApiToken: !!CLOUDFLARE_API_TOKEN,
        hasJwtSecret: !!JWT_SECRET,
        hasAccountId: !!ACCOUNT_ID,
        hasKv: !!env.CERTIFICATES_KV
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response('Not found', { status: 404, headers: corsHeaders });
}