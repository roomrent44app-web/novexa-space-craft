import { createClient, corsHeaders } from 'npm:@supabase/supabase-js@2'
import { createHmac, timingSafeEqual } from 'node:crypto'

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

  const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!webhookSecret || !url || !serviceKey) return json({ error: 'Webhook is not configured.' }, 503)

  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
  if (!safeHexEqual(expected, signature)) return json({ error: 'Invalid signature.' }, 401)

  try {
    const event = JSON.parse(rawBody) as {
      event?: string
      payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } }
    }
    if (!['payment.captured', 'order.paid'].includes(event.event ?? '')) return json({ received: true })
    const payment = event.payload?.payment?.entity
    if (!payment?.order_id || !payment.id) return json({ received: true })

    const admin = createClient(url, serviceKey)
    const { data: subscription } = await admin.from('subscriptions').select('id,duration_days,status').eq('razorpay_order_id', payment.order_id).maybeSingle()
    if (!subscription || subscription.status === 'active') return json({ received: true })

    const startsAt = new Date()
    const expiresAt = new Date(startsAt.getTime() + subscription.duration_days * 86400000)
    const { error } = await admin.from('subscriptions').update({
      status: 'active',
      razorpay_payment_id: payment.id,
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: startsAt.toISOString(),
    }).eq('id', subscription.id)
    if (error) throw error
    return json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return json({ error: 'Webhook processing failed.' }, 500)
  }
})
