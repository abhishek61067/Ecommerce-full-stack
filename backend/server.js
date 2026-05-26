import express from "express"
import dotenv from "dotenv";
import Stripe from 'stripe';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = 5000;

// create checkout session
app.post('/create-checkout-session', async (req, res) => {
    try{
   const {cartItems} = req.body;

//store cartitems in db or tempporary memory(example use mock orderId)
const orderId = Date.now(); // mock orderId using timestamp

const line_items = cartItems.map((item)=>{
return {
    price_data: {
        currency: 'usd',
        product_data: {
            name: item.title,
            images: [item.thumbnail], // optional: add product image
        },
    unit_amount: item.price * 100, // convert to cents
},
quantity: item.quantity
}
});

const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `http://localhost:5173/success`,
    cancel_url: 'http://localhost:3000/cart',
});

res.json({ url: session.url });

} catch (error) {
        res.status(500).json({ error: error.message ||"An error occurred" });
    }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});