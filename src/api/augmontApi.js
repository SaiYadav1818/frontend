const BASE_URL = "http://localhost:8080";

/* GOLD RATES */

export const getGoldRates = async () => {

  const res = await fetch(`${BASE_URL}/v1/augmont/rates`);
  return await res.json();

};

/* PORTFOLIO */

export const getPortfolio = async (uniqueId) => {

  const res = await fetch(`${BASE_URL}/v1/augmont/users/${uniqueId}/passbook`);
  return await res.json();

};

/* BUY GOLD */

export const buyGold = async (payload) => {

  const res = await fetch(`${BASE_URL}/v1/augmont/buy`, {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)

  });

  return await res.json();

};

/* SELL GOLD */

export const sellGold = async (payload) => {

  const res = await fetch(`${BASE_URL}/v1/augmont/sell`, {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)

  });

  return await res.json();

};

/* TRANSACTIONS */

export const getBuyTransactions = async (uniqueId) => {

  const res = await fetch(`${BASE_URL}/v1/augmont/buy/users/${uniqueId}`);
  return await res.json();

};

export const getSellTransactions = async (uniqueId) => {

  const res = await fetch(`${BASE_URL}/v1/augmont/sell/users/${uniqueId}`);
  return await res.json();

};
/* ---------------- LOGIN ---------------- */

export const loginUser = async (email, password) => {

  const response = await fetch(`${API_BASE}/v1/augmont/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  return data;

};
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
