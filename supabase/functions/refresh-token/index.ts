import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createHash } from 'https://deno.land/std@0.168.0/hash/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RefreshTokenRequest {
  clientId: string
  secret: string
  refreshToken: string
  dataCenter: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          msg: 'Method not allowed. Use POST.'
        }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { clientId, secret, refreshToken, dataCenter }: RefreshTokenRequest = await req.json()

    // Validate required parameters
    if (!clientId || !secret || !refreshToken || !dataCenter) {
      return new Response(
        JSON.stringify({
          success: false,
          msg: 'Missing required parameters: clientId, secret, refreshToken, or dataCenter'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get current timestamp
    const timestamp = Date.now().toString()

    // Create signature
    const str = clientId + timestamp
    const hash = createHash('sha256')
    hash.update(str, 'utf8')
    const signature = hash.toString('hex').toUpperCase()

    // Make request to Tuya API
    const response = await fetch(`${dataCenter}/v1.0/token/${refreshToken}`, {
      method: 'GET',
      headers: {
        'client_id': clientId,
        'sign': signature,
        't': timestamp,
        'sign_method': 'HMAC-SHA256'
      }
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error refreshing token:', error)

    return new Response(
      JSON.stringify({
        success: false,
        msg: error.message || 'Internal server error',
        error: error
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})