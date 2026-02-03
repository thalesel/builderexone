
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Setup Supabase Client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Secure Token
const KIWIFY_TOKEN = Deno.env.get('KIWIFY_WEBHOOK_TOKEN') ?? '';

serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // 1. Verify Token (Security)
        // Kiwify sends token in query param usually, or body. 
        // We check URL params first.
        const url = new URL(req.url);
        const token = url.searchParams.get('token');

        // Also check payload just in case (some providers are weird)
        // But standard verification is checking what we configured in Kiwify URL.
        // If user configured URL as ...?token=XYZ, then it's in params.
        // If Kiwify sends signature, we use that.
        // The user just gave a "Token", likely the one shown in Webhook settings that is sent in payload?
        // Actually, Kiwify sends a "token" field in the JSON body.

        const payload = await req.json();

        // Check Payload Token
        if (KIWIFY_TOKEN && payload.token !== KIWIFY_TOKEN) {
            // Also check query param if payload fails
            if (token !== KIWIFY_TOKEN) {
                console.error('Invalid Token');
                return new Response('Unauthorized', { status: 401 });
            }
        }

        console.log('Kiwify Webhook Verified & Received:', JSON.stringify(payload));

        const order_status = payload.order_status || payload.status;
        const customer = payload.customer || payload.Customer;

        // Valid statuses: paid, approved
        if (order_status === 'paid' || order_status === 'approved') {

            if (!customer || !customer.email) {
                console.error("No customer email in payload");
                // Return 200 to acknowledge
                return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
            }

            // Find User
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', customer.email)
                .single();

            if (userError || !user) {
                console.error(`User not found: ${customer.email}`);
                return new Response(JSON.stringify({ received: true, status: 'user_not_found' }), { headers: { 'Content-Type': 'application/json' } });
            }

            // Logic: Combo vs Slot
            const productName = (payload.product_name || payload.Product?.name || payload.product?.name || '').toLowerCase();
            const amount = payload.amount || payload.commissions?.charge_amount || 0;

            let type = 'slot';
            let slotsToAdd = 0;

            if (productName.includes('combo') || productName.includes('inicial') || amount >= 1900) {
                type = 'plano';
                slotsToAdd = 3;
            } else {
                type = 'slot';
                slotsToAdd = 1;
            }

            // Record Payment
            await supabase.from('pagamentos').insert({
                user_id: user.id,
                tipo: type,
                valor: amount,
                status: 'completed',
                stripe_session_id: payload.order_id || payload.id || 'kiwify_txn'
            });

            // Increment
            if (slotsToAdd > 0) {
                await supabase.rpc('increment_slots', { p_user_id: user.id, count: slotsToAdd });
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (err) {
        console.error('Webhook Error:', err.message);
        return new Response(err.message, { status: 400 })
    }
})
