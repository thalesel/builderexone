
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { type, userId } = await req.json()

        // Validate Input
        if (!type || !userId) {
            throw new Error("Missing type or userId");
        }

        // Define Prices (Replace with real Price IDs or logic)
        // APP_CONFIG.PRICES is client side, here we should use Stripe Price IDs
        let priceId = '';
        let quantity = 1;

        // Example logic mapping type to Price ID
        if (type === 'plano') priceId = 'price_H5ggYJDq...'; // Base Plan
        else if (type === 'slot') priceId = 'price_G5ff...'; // Extra Slot
        else if (type === 'live_help') priceId = 'price_...';

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'boleto'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product: type === 'plano' ? 'prod_TuJ1ALgZ3M7YEQ' : (type === 'slot' ? 'prod_TuJ12fk2eTypgo' : 'prod_live_help_placeholder'),
                        unit_amount: type === 'plano' ? 2000 : (type === 'slot' ? 500 : 2000),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/dashboard?success=true`,
            cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`,
            metadata: {
                userId,
                type
            }
        });

        return new Response(
            JSON.stringify({ url: session.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
