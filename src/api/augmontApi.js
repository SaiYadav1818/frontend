import API_BASE from "./config";

/* ---------------- GET GOLD RATES ---------------- */

// export const getGoldRates = async () => {

//   const response = await fetch(`${API_BASE}/v1/augmont/rates`);

//   const data = await response.json();

//   return data.payload.result.data;

// };
export const getGoldRates = async () => {

  const response = await fetch(`${API_BASE}/v1/augmont/rates`);

  const data = await response.json();

  console.log("Rates API Response:", data); // important for debugging

  return data.payload.result.data;

};

/* ---------------- GET PRODUCTS ---------------- */

export const getProducts = async () => {

  const response = await fetch(`${API_BASE}/v1/augmont/products`);

  const data = await response.json();

  return data.payload.result.data;

};

/* ---------------- CREATE USER ---------------- */

export const createUser = async (userData) => {

  const response = await fetch(`${API_BASE}/v1/augmont/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return response.json();

};

/* ---------------- BUY GOLD ---------------- */

export const buyGold = async (payload) => {

  const response = await fetch(`${API_BASE}/v1/augmont/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response.json();

};

/* ---------------- SELL GOLD ---------------- */

export const sellGold = async (payload) => {

  const response = await fetch(`${API_BASE}/v1/augmont/sell`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response.json();

};

/* ---------------- PORTFOLIO ---------------- */

export const getPassbook = async (uniqueId) => {

  const response = await fetch(`${API_BASE}/v1/augmont/users/${uniqueId}/passbook`);

  const data = await response.json();

  return data.payload.result.data;

};