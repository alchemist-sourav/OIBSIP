const axios = require('axios');

async function test() {
    try {
        const res = await axios.post("http://localhost:5000/api/orders", {
            pizza: { base: "Thin Crust", sauce: "Tomato", cheese: "Mozzarella", veggies: [] },
            totalPrice: 299,
            paymentStatus: "Paid"
        });
        console.log("Success:", res.data);
    } catch(e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}
test();
