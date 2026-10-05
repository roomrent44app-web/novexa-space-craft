import { createClient, corsHeaders } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3.25.76'

const BodySchema = z.object({ planCode: z.string().min(1).max(30) })
const PLANS: Record<string, { name: string; days: number; amount: number }> = {
  '3d-149': { name: '3 Days Plan', days: 3, amount: 14900 },
  '4d-199': { name: '4 Days Plan', days: 4, amount: 19900 },
  '6d-249': { name: '6 Days Plan', days: 6, amount: 24900 },
  '9d-499': { name: '9 Days Plan', days: 9, amount: 49900 },
  '15d-799': { name: '15 Days Plan', days: 15, amount: 79900 },
  '21d-1099': { name: '21 Days Plan', days: 21, amount: 109900 },
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const url = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!url || !anonKey || !serviceKey || !keyId || !keySecret) return json({ error: 'Payment setup is not complete yet.' }, 503)

    const authClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user) return json({ error: 'Please log in before purchasing a plan.' }, 401)

    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) return json({ error: 'Invalid plan.' }, 400)
    const plan = PLANS[parsed.data.planCode]
    if (!plan) return json({ error: 'This plan is not available.' }, 400)

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.amount,
        currency: 'INR',
        receipt: `5am_${crypto.randomUUID().replaceAll('-', '').slice(0, 24)}`,
        notes: { user_id: user.id, plan_code: parsed.data.planCode },
      }),
    })
    const orderBody = await orderResponse.text()
    if (!orderResponse.ok) {
      console.error(`Razorpay order failed [${orderResponse.status}]: ${orderBody}`)
      return json({ error: 'Could not start payment. Please try again.' }, 502)
    }
    const order = JSON.parse(orderBody) as { id: string; amount: number; currency: string }
    const admin = createClient(url, serviceKey)
    const { error: insertError } = await admin.from('subscriptions').insert({
      user_id: user.id,
      plan_code: parsed.data.planCode,
      plan_name: plan.name,
      duration_days: plan.days,
      amount_paise: plan.amount,
      razorpay_order_id: order.id,
      status: 'pending',
    })
    if (insertError) {
      console.error('Subscription order save failed:', insertError.message)
      return json({ error: 'Could not save payment order. Please retry.' }, 500)
    }

    return json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId, planName: plan.name })
  } catch (error) {
    console.error('Create order error:', error)
    return json({ error: 'Could not start payment. Please try again.' }, 500)
  }
})
