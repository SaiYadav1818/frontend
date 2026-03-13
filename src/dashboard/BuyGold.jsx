
// import { useState } from "react";
// import { Coins, TrendingUp } from "lucide-react";

// function BuyGold() {

//   const goldPrice = 6554;

//   const [amount, setAmount] = useState("5000.00");

//   const grams = (Number(amount) / goldPrice).toFixed(3);
//   const gst = (Number(amount) * 0.03).toFixed(2);
//   const total = (Number(amount) + Number(gst)).toFixed(2);

//   const buyGold = () => {

//     const existingGold = Number(localStorage.getItem("goldOwned")) || 0;

//     const updatedGold = existingGold + Number(grams);

//     localStorage.setItem("goldOwned", updatedGold.toFixed(3));

//     alert("Gold purchased successfully!");

//   };

//   return (

//     <div className="max-w-5xl mx-auto space-y-10">

//       <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10">

//         <div className="flex justify-between items-center">

//           <div>

//             <p className="text-white/60 text-sm">
//               Live Gold Price
//             </p>

//             <h2 className="text-4xl font-bold text-yellow-400 mt-1">
//               ₹{goldPrice}
//             </h2>

//             <p className="text-green-400 flex items-center gap-1 mt-2 text-sm">
//               <TrendingUp size={14}/>
//               +1.14% today
//             </p>

//           </div>

//           <Coins size={40} className="text-yellow-400"/>

//         </div>

//       </div>

//       <div className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6">

//         <h3 className="text-xl font-semibold">
//           Buy Digital Gold
//         </h3>

//         <div className="flex gap-4">

//           {[1000,5000,10000,20000].map((value)=>(
//             <button
//               key={value}
//               onClick={()=>setAmount(value.toFixed(2))}
//               className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
//             >
//               ₹{value}
//             </button>
//           ))}

//         </div>

//         <div>

//           <label className="text-white/60 text-sm">
//             Enter Amount
//           </label>

//           <input
//             type="text"
//             value={amount}
//             onChange={(e)=>setAmount(e.target.value)}
//             onBlur={()=>setAmount(Number(amount).toFixed(2))}
//             className="w-full mt-2 bg-black border border-white/10 rounded-lg px-4 py-3 text-lg focus:border-yellow-400 outline-none"
//           />

//         </div>

//         <div className="bg-black border border-white/10 rounded-xl p-5 space-y-3">

//           <div className="flex justify-between text-sm">
//             <span className="text-white/60">Gold Quantity</span>
//             <span>{grams} grams</span>
//           </div>

//           <div className="flex justify-between text-sm">
//             <span className="text-white/60">GST (3%)</span>
//             <span>₹{gst}</span>
//           </div>

//           <div className="flex justify-between text-lg font-semibold text-yellow-400">
//             <span>Total Payable</span>
//             <span>₹{total}</span>
//           </div>

//         </div>

//         <button
//           onClick={buyGold}
//           className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl hover:scale-105 transition"
//         >
//           Buy Gold
//         </button>

//       </div>

//     </div>

//   );

// }

// export default BuyGold;
//===================================================================
//BACKEND CODE FOR BUYGOLD FUNCTIONALITY
// import { useState, useEffect } from "react";
// import { Coins, TrendingUp } from "lucide-react";
// import { getGoldRates, buyGold } from "../api/augmontApi";

// function BuyGold() {

//   const [goldPrice, setGoldPrice] = useState(0);
//   const [blockId, setBlockId] = useState("");
//   const [amount, setAmount] = useState(5000);

//   /* ---------------- FETCH GOLD RATE ---------------- */

//   useEffect(() => {

//     const loadRates = async () => {

//       try {

//         const data = await getGoldRates();

//         console.log("Rates API:", data);

//         const price = parseFloat(data.rates.gBuy);
//         const block = data.blockId;

//         setGoldPrice(price);
//         setBlockId(block);

//       } catch (error) {

//         console.error("Error loading rates:", error);

//       }

//     };

//     loadRates();

//   }, []);

//   /* ---------------- CALCULATIONS ---------------- */

//   const grams = goldPrice
//     ? (amount / goldPrice).toFixed(3)
//     : "0.000";

//   const gst = (amount * 0.03).toFixed(2);

//   const total = (Number(amount) + Number(gst)).toFixed(2);

//   /* ---------------- BUY FUNCTION ---------------- */

//   const handleBuy = async () => {

//     const uniqueId = localStorage.getItem("uniqueId");

//     if (!uniqueId) {

//       alert("User not registered");
//       return;

//     }

//     const payload = {

//       lockPrice: "1",
//       metalType: "gold",
//       quantity: grams,
//       amount: amount.toFixed(2),
//       merchantTransactionId: "BUY_" + Date.now(),
//       uniqueId: uniqueId,
//       blockId: blockId,
//       modeOfPayment: "upi"

//     };

//     try {

//       const response = await buyGold(payload);

//       console.log("Buy Response:", response);

//       alert("Gold purchase successful!");

//     } catch (error) {

//       console.error("Buy failed:", error);

//       alert("Buy failed");

//     }

//   };

//   return (

//     <div className="max-w-5xl mx-auto space-y-10">

//       {/* HERO CARD */}

//       <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10 overflow-hidden">

//         <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-yellow-500/20 blur-[120px] rounded-full"></div>

//         <div className="relative flex justify-between items-center">

//           <div>

//             <p className="text-white/60 text-sm">
//               Live Gold Price
//             </p>

//             <h2 className="text-4xl font-bold text-yellow-400 mt-1">
//               ₹{goldPrice}
//             </h2>

//             <p className="text-green-400 flex items-center gap-1 mt-2 text-sm">
//               <TrendingUp size={14}/>
//               Live Market Rate
//             </p>

//           </div>

//           <Coins size={40} className="text-yellow-400"/>

//         </div>

//       </div>

//       {/* BUY PANEL */}

//       <div className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6">

//         <h3 className="text-xl font-semibold">
//           Buy Digital Gold
//         </h3>

//         {/* QUICK BUTTONS */}

//         <div className="flex gap-4">

//           {[1000,5000,10000,20000].map((value)=>(

//             <button
//               key={value}
//               onClick={()=>setAmount(value)}
//               className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
//             >
//               ₹{value}
//             </button>

//           ))}

//         </div>

//         {/* INPUT */}

//         <div>

//           <label className="text-white/60 text-sm">
//             Enter Amount
//           </label>

//           <input
//             type="number"
//             step="0.01"
//             value={amount}
//             onChange={(e)=>setAmount(parseFloat(e.target.value) || 0)}
//             className="w-full mt-2 bg-black border border-white/10 rounded-lg px-4 py-3 text-lg focus:border-yellow-400 outline-none"
//           />

//         </div>

//         {/* CALCULATION */}

//         <div className="bg-black border border-white/10 rounded-xl p-5 space-y-3">

//           <div className="flex justify-between text-sm">
//             <span className="text-white/60">Gold Quantity</span>
//             <span>{grams} grams</span>
//           </div>

//           <div className="flex justify-between text-sm">
//             <span className="text-white/60">GST (3%)</span>
//             <span>₹{gst}</span>
//           </div>

//           <div className="flex justify-between text-lg font-semibold text-yellow-400">
//             <span>Total Payable</span>
//             <span>₹{total}</span>
//           </div>

//         </div>

//         {/* BUY BUTTON */}

//         <button
//           onClick={handleBuy}
//           className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-105 transition"
//         >
//           Buy Gold
//         </button>

//       </div>

//     </div>

//   );

// }

// export default BuyGold;
import { useState, useEffect } from "react";
import { Coins, TrendingUp } from "lucide-react";
import { getGoldRates, buyGold } from "../api/augmontApi";

function BuyGold() {

  const [goldPrice, setGoldPrice] = useState(0);
  const [amount, setAmount] = useState(5000);

  const grams = (amount / goldPrice).toFixed(3);
  const gst = (amount * 0.03).toFixed(2);
  const total = (Number(amount) + Number(gst)).toFixed(2);

  useEffect(() => {

    const loadRates = async () => {

      try {

        const data = await getGoldRates();

        const price =
          parseFloat(data?.payload?.result?.data?.rates?.gBuy || 0);

        setGoldPrice(price);

      } catch (error) {

        console.error("Rate load failed", error);

      }

    };

    loadRates();

  }, []);

  const handleBuy = async () => {

    const uniqueId = localStorage.getItem("uniqueId");

    const payload = {

      lockPrice: "1",
      metalType: "gold",
      quantity: grams,
      amount: total,
      merchantTransactionId: "BUY_" + Date.now(),
      uniqueId: uniqueId,
      blockId: "BLOCK001",
      modeOfPayment: "upi",
      referenceType: "order",
      referenceId: "REF_" + Date.now()

    };

    try {

      const res = await buyGold(payload);

      console.log("BUY RESPONSE", res);

      alert("Gold purchase initiated");

    } catch (error) {

      console.error("Buy failed", error);

    }

  };

  return (

    <div className="max-w-5xl mx-auto space-y-10">

      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10">

        <p className="text-white/60 text-sm">
          Live Gold Price
        </p>

        <h2 className="text-4xl font-bold text-yellow-400 mt-1">
          ₹{goldPrice}
        </h2>

        <p className="text-green-400 flex items-center gap-1 mt-2 text-sm">
          <TrendingUp size={14}/>
          Live Market
        </p>

      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6">

        <h3 className="text-xl font-semibold">
          Buy Digital Gold
        </h3>

        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
        />

        <div className="bg-black border border-white/10 rounded-xl p-5 space-y-2">

          <div className="flex justify-between">
            <span>Gold Quantity</span>
            <span>{grams} g</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹{gst}</span>
          </div>

          <div className="flex justify-between text-yellow-400 font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

        </div>

        <button
          onClick={handleBuy}
          className="w-full bg-yellow-500 text-black py-4 rounded-xl font-semibold"
        >
          Buy Gold
        </button>

      </div>

    </div>

  );

}

export default BuyGold;