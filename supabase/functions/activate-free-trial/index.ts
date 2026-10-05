import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TRIAL = { planCode: 'trial-3d', planName: '3 Days Free Trial', days: 3, amountPaise: 0 }

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const url = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !anonKey || !serviceKey) return json({ error: 'Free trial is not available yet.' }, 503)

    const authClient = createClient(url, anonKey, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } })
    const { data: { user }, error: userError } = await authClient.auth.getUser()
    if (userError || !user) return json({ error: 'Please log in before starting your free trial.' }, 401)

    const body = await req.json().catch(() => ({})) as { classDays?: unknown }
    const allowed = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    const classDays = Array.isArray(body.classDays) ? [...new Set(body.classDays.filter((d): d is string => typeof d === 'string' && allowed.includes(d)))] : []
    if (classDays.length !== TRIAL.days) return json({ error: 'Please select exactly 3 class days.' }, 400)

    const admin = createClient(url, serviceKey)
    const { data: existing, error: checkError } = await admin
      .from('subscriptions')
      .select('id,status,plan_code')
      .eq('user_id', user.id)
    if (checkError) {
      console.error('Free trial check failed:', checkError.message)
      return json({ error: 'Could not start the free trial. Please try again.' }, 500)
    }
    const blocked = (existing ?? []).some(
      (row) => row.plan_code === TRIAL.planCode || row.status === 'active' || row.status === 'pending',
    )
    if (blocked) return json({ ok: false, error: 'The free trial can be used only once per account.' })

    const startsAt = new Date()
    const expiresAt = new Date(startsAt.getTime() + TRIAL.days * 86400000)
    const { error: insertError } = await admin.from('subscriptions').insert({
      user_id: user.id,
      plan_code: TRIAL.planCode,
      plan_name: TRIAL.planName,
      duration_days: TRIAL.days,
      amount_paise: TRIAL.amountPaise,
      status: 'active',
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      razorpay_order_id: `trial_${crypto.randomUUID().replaceAll('-', '').slice(0, 20)}`,
      source: 'free_trial',
      class_days: classDays,
    })
    if (insertError) {
      console.error('Free trial save failed:', insertError.message)
      return json({ error: 'Could not start the free trial. Please try again.' }, 500)
    }

    return json({ planName: TRIAL.planName, expiresAt: expiresAt.toISOString() })
  } catch (error) {
    console.error('Free trial error:', error)
    return json({ error: 'Could not start the free trial. Please try again.' }, 500)
  }
})
