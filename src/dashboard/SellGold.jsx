// import { useState } from "react";
// import { Coins, TrendingDown } from "lucide-react";

// function SellGold() {

//   const goldPrice = 6554;
//   const goldOwned = 37.5;

//   const [grams, setGrams] = useState(2);

//   const payout = (grams * goldPrice).toFixed(2);

//   return (

//     <div className="max-w-5xl mx-auto space-y-10">

//       {/* HERO */}

//       <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10 overflow-hidden">

//         <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-yellow-500/20 blur-[120px] rounded-full"></div>

//         <div className="relative flex justify-between items-center">

//           <div>

//             <p className="text-white/60 text-sm">
//               Gold Balance
//             </p>

//             <h2 className="text-4xl font-bold text-yellow-400 mt-1">
//               {goldOwned.toFixed(3)} grams
//             </h2>

//           </div>

//           <Coins size={40} className="text-yellow-400"/>

//         </div>

//       </div>

//       {/* SELL PANEL */}

//       <div className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6">

//         <h3 className="text-xl font-semibold">
//           Sell Digital Gold
//         </h3>

//         {/* QUICK BUTTONS */}

//         <div className="flex gap-4">

//           {[1,5,10].map((value)=>(
//             <button
//               key={value}
//               onClick={()=>setGrams(value)}
//               className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
//             >
//               {value} grams
//             </button>
//           ))}

//           <button
//             onClick={()=>setGrams(goldOwned)}
//             className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
//           >
//             Sell All
//           </button>

//         </div>

//         {/* INPUT */}

//         <div>

//           <label className="text-white/60 text-sm">
//             Enter Gold Quantity
//           </label>

//           <input
//             type="number"
//             value={grams}
//             onChange={(e)=>setGrams(e.target.value)}
//             className="w-full mt-2 bg-black border border-white/10 rounded-lg px-4 py-3 text-lg focus:border-yellow-400 outline-none"
//           />

//         </div>

//         {/* CALCULATION */}

//         <div className="bg-black border border-white/10 rounded-xl p-5">

//           <div className="flex justify-between text-lg font-semibold text-yellow-400">
//             <span>Total Payout</span>
//             <span>₹{payout}</span>
//           </div>

//         </div>

//         {/* SELL BUTTON */}

//         <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-105 transition">
//           Sell Gold
//         </button>

//       </div>

//     </div>

//   );
// }

// export default SellGold;

//===============================
//SELL GOLD WITH BACKEND INTEGRATION
import { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { sellGold } from "../api/augmontApi";

function SellGold() {

  const goldPrice = 6554;

  const [goldOwned, setGoldOwned] = useState(0);
  const [grams, setGrams] = useState(1);

  /* LOAD USER GOLD BALANCE (TEMP until portfolio API connected) */

  useEffect(() => {

    const storedGold = localStorage.getItem("goldBalance");

    if (storedGold) {
      setGoldOwned(parseFloat(storedGold));
    }

  }, []);

  const payout = (grams * goldPrice).toFixed(2);

  /* SELL GOLD */

  const handleSell = async () => {

    const uniqueId = localStorage.getItem("uniqueId");

    if (!uniqueId) {

      alert("User not logged in");
      return;

    }

    if (grams > goldOwned) {

      alert("Not enough gold balance");
      return;

    }

    const payload = {

      uniqueId: uniqueId,
      lockPrice: "1",
      blockId: "BLOCK001",
      metalType: "gold",
      quantity: grams.toFixed(3),
      amount: payout,
      merchantTransactionId: "SELL_" + Date.now(),
      userBankId: "BANK001",
      accountName: "User",
      accountNumber: "1234567890",
      ifscCode: "HDFC0001234"

    };

    try {

      const response = await sellGold(payload);

      console.log("Sell response:", response);

      alert("Sell order placed successfully");

    } catch (error) {

      console.error("Sell failed:", error);

      alert("Sell request failed");

    }

  };

  return (

    <div className="max-w-5xl mx-auto space-y-10">

      {/* GOLD BALANCE */}

      <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-yellow-500/20 rounded-3xl p-10">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-white/60 text-sm">
              Gold Balance
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-1">
              {goldOwned.toFixed(3)} grams
            </h2>

          </div>

          <Coins size={40} className="text-yellow-400"/>

        </div>

      </div>

      {/* SELL PANEL */}

      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 space-y-6">

        <h3 className="text-xl font-semibold">
          Sell Digital Gold
        </h3>

        {/* QUICK BUTTONS */}

        <div className="flex gap-4 flex-wrap">

          {[1,5,10].map((value)=>(
            <button
              key={value}
              onClick={()=>setGrams(value)}
              className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              {value} grams
            </button>
          ))}

          <button
            onClick={()=>setGrams(goldOwned)}
            className="px-5 py-2 border border-white/10 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            Sell All
          </button>

        </div>

        {/* INPUT */}

        <div>

          <label className="text-white/60 text-sm">
            Enter Gold Quantity
          </label>

          <input
            type="number"
            step="0.001"
            value={grams}
            onChange={(e)=>setGrams(parseFloat(e.target.value) || 0)}
            className="w-full mt-2 bg-black border border-white/10 rounded-lg px-4 py-3 text-lg focus:border-yellow-400 outline-none"
          />

        </div>

        {/* PAYOUT */}

        <div className="bg-black border border-white/10 rounded-xl p-5">

          <div className="flex justify-between text-lg font-semibold text-yellow-400">

            <span>Total Payout</span>

            <span>₹{payout}</span>

          </div>

        </div>

        {/* SELL BUTTON */}

        <button
          onClick={handleSell}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-105 transition"
        >
          Sell Gold
        </button>

      </div>

    </div>

  );

}

export default SellGold;