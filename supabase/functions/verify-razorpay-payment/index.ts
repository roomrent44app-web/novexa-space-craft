import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { createHmac, timingSafeEqual } from 'node:crypto'
import { z } from 'npm:zod@3.25.76'

const BodySchema = z.object({
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().regex(/^[a-f0-9]{64}$/i),
})
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})
const safeHexEqual = (a: string, b: string) => {
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b) || a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const url = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!url || !anonKey || !serviceKey || !keySecret) return json({ error: 'Payment setup is not complete yet.' }, 503)

    const authClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user) return json({ error: 'Please log in again.' }, 401)

    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) return json({ error: 'Invalid payment response.' }, 400)
    const body = parsed.data
    const expected = createHmac('sha256', keySecret).update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`).digest('hex')
    if (!safeHexEqual(expected, body.razorpay_signature)) return json({ error: 'Payment verification failed.' }, 400)

    const admin = createClient(url, serviceKey)
    const { data: subscription } = await admin.from('subscriptions').select('id,user_id,duration_days,status').eq('razorpay_order_id', body.razorpay_order_id).maybeSingle()
    if (!subscription || subscription.user_id !== user.id) return json({ error: 'Payment order was not found.' }, 404)
    if (subscription.status === 'active') return json({ success: true })

    const startsAt = new Date()
    const expiresAt = new Date(startsAt.getTime() + subscription.duration_days * 86400000)
    const { error: updateError } = await admin.from('subscriptions').update({
      status: 'active',
      razorpay_payment_id: body.razorpay_payment_id,
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: startsAt.toISOString(),
    }).eq('id', subscription.id)
    if (updateError) throw updateError

    return json({ success: true, expiresAt: expiresAt.toISOString() })
  } catch (error) {
    console.error('Verify payment error:', error)
    return json({ error: 'Payment was received but activation is delayed. Please refresh shortly.' }, 500)
  }
})
