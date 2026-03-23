const BASE_URL =
  import.meta.env.VITE_AUGMONT_BASE_URL?.trim() ||
  "https://uatbckend.karatly.net";
const DEFAULT_MERCHANT_ID =
  import.meta.env.VITE_AUGMONT_MERCHANT_ID?.trim() || "11692";
const AUGMONT_LOGIN_EMAIL =
  import.meta.env.VITE_AUGMONT_LOGIN_EMAIL?.trim() ||
  "Onboarding@sabbpe.com";
const AUGMONT_LOGIN_PASSWORD =
  import.meta.env.VITE_AUGMONT_LOGIN_PASSWORD?.trim() ||
  "Z1!pX6@S3#vK9a";
const AUGMONT_PRODUCTS_TOKEN =
  import.meta.env.VITE_AUGMONT_PRODUCTS_TOKEN?.trim() || "";
const AUGMONT_SESSION_KEY = "augmontSession";
const LIVE_GOLD_RATE_HISTORY_KEY = "liveGoldRateHistory";
const LIVE_GOLD_RATE_HISTORY_LIMIT = 12;
const AUGMONT_USER_KEY = "augmontUser";
const AUGMONT_ORDER_REFERENCES_KEY = "augmontOrderReferences";

const getJson = async (res) => {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      status: "error",
      payload: {
        statusCode: res.status,
        message: text || "Invalid server response"
      }
    };
  }
};

const extractBackendMessage = (data, fallback = "Request failed") => {
  const payloadMessage = data?.payload?.message;
  const responseBody = data?.payload?.responseBody;

  if (typeof responseBody === "string") {
    try {
      const parsed = JSON.parse(responseBody);
      return parsed?.message || payloadMessage || fallback;
    } catch {
      return responseBody || payloadMessage || fallback;
    }
  }

  return payloadMessage || data?.message || fallback;
};

const getStoredAugmontUser = () => {
  try {
    const raw = localStorage.getItem(AUGMONT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredOrderReferences = () => {
  try {
    const raw = localStorage.getItem(AUGMONT_ORDER_REFERENCES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const storeOrderReference = (reference) => {
  if (!reference?.merchantTransactionId && !reference?.transactionId) {
    return;
  }

  const nextReference = {
    ...reference,
    storedAt: new Date().toISOString()
  };
  const existing = getStoredOrderReferences().filter(
    (item) =>
      item?.merchantTransactionId !== nextReference.merchantTransactionId &&
      item?.transactionId !== nextReference.transactionId
  );

  localStorage.setItem(
    AUGMONT_ORDER_REFERENCES_KEY,
    JSON.stringify([nextReference, ...existing].slice(0, 50))
  );
};

const setStoredAugmontUser = (user) => {
  const existing = getStoredAugmontUser() || {};
  localStorage.setItem(
    AUGMONT_USER_KEY,
    JSON.stringify({
      ...existing,
      ...user
    })
  );
};

export const normalizeAugmontUserProfile = (data, fallbackUniqueId = "") => {
  const result =
    data?.payload?.result?.data ||
    data?.payload?.result ||
    data?.payload?.data ||
    data?.data ||
    data ||
    {};

  return {
    userName: result?.userName || result?.name || "",
    uniqueId:
      result?.uniqueId ||
      result?.userUniqueId ||
      result?.customerUniqueId ||
      fallbackUniqueId,
    customerMappedId: result?.customerMappedId || "",
    mobileNumber: result?.mobileNumber || result?.mobileNo || "",
    userEmail: result?.userEmail || result?.emailId || result?.email || "",
    userStateId: result?.userStateId || result?.stateId || "",
    userCityId: result?.userCityId || result?.cityId || "",
    userPincode:
      result?.userPincode || result?.pincode || result?.pinCode || "",
    kycStatus: result?.kycStatus || "",
    userState: result?.userState || "",
    userCity: result?.userCity || "",
    createdAt: result?.createdAt || "",
    userBankId: result?.userBankId || "",
    userAddressId: result?.userAddressId || "",
    raw: result
  };
};

const selectProductImage = (images) => {
  if (!Array.isArray(images) || images.length === 0) return "";

  const defaultImage = images.find(
    (image) => image?.defaultImage && image?.url
  );
  if (defaultImage) return defaultImage.url;

  const orderedImage = [...images]
    .filter((image) => image?.url)
    .sort(
      (a, b) =>
        (a?.displayOrder ?? Number.MAX_SAFE_INTEGER) -
        (b?.displayOrder ?? Number.MAX_SAFE_INTEGER)
    )[0];

  return orderedImage?.url || "";
};

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickFirstPositiveNumber = (...values) => {
  for (const value of values) {
    const parsed = toNumber(value);
    if (parsed > 0) {
      return parsed;
    }
  }

  return 0;
};

const normalizeProduct = (product) => ({
  id: product?.sku || `product-${Math.random().toString(36).slice(2, 9)}`,
  sku: product?.sku || "",
  name: product?.name || "Untitled Product",
  description:
    product?.description && product.description !== "NA"
      ? product.description
      : "",
  basePrice: product?.basePrice || "0",
  metalType: product?.metalType || "NA",
  purity: product?.purity || "NA",
  productWeight: product?.productWeight || "NA",
  redeemWeight: product?.redeemWeight || "NA",
  jewelleryType: product?.jewelleryType || "NA",
  productSize: product?.productSize || "NA",
  status: product?.status || "inactive",
  productImages: Array.isArray(product?.productImages)
    ? product.productImages
    : [],
  imageUrl: selectProductImage(product?.productImages)
});

const normalizePagination = (pagination = {}) => ({
  hasMore: Boolean(pagination?.hasMore),
  count: Number(pagination?.count || 0),
  per_page: Number(pagination?.per_page || 0),
  current_page: Number(pagination?.current_page || 1)
});

const extractAugmontSession = (data) => {
  const token =
    data?.token ||
    data?.accessToken ||
    data?.payload?.token ||
    data?.payload?.accessToken ||
    data?.payload?.result?.token ||
    data?.payload?.result?.accessToken ||
    data?.payload?.result?.data?.token ||
    data?.payload?.result?.data?.accessToken;
  const merchantId =
    data?.merchantId ||
    data?.payload?.merchantId ||
    data?.payload?.result?.merchantId ||
    data?.payload?.result?.data?.merchantId;

  return {
    token: token ? String(token) : "",
    merchantId: merchantId ? String(merchantId) : DEFAULT_MERCHANT_ID
  };
};

const extractAugmontUser = (data, fallbackUniqueId = "") => {
  const result = normalizeAugmontUserProfile(data, fallbackUniqueId);

  return {
    userName: result?.userName || "",
    uniqueId: result?.uniqueId || data?.uniqueId || fallbackUniqueId,
    customerMappedId: result?.customerMappedId || "",
    mobileNumber: result?.mobileNumber || "",
    userEmail: result?.userEmail || "",
    userStateId: result?.userStateId || "",
    userCityId: result?.userCityId || "",
    userPincode: result?.userPincode || "",
    kycStatus: result?.kycStatus || "",
    userState: result?.userState || "",
    userCity: result?.userCity || "",
    createdAt: result?.createdAt || "",
    userBankId: result?.userBankId || "",
    userAddressId: result?.userAddressId || ""
  };
};

const findRateValue = (container = {}, keys = []) =>
  pickFirstPositiveNumber(...keys.map((key) => container?.[key]));

const extractOrderResult = (data) =>
  data?.result?.data ||
  data?.result ||
  data?.payload?.result?.data ||
  data?.payload?.result ||
  data?.payload?.data ||
  data?.data ||
  data ||
  {};

const extractOrderArray = (data) => {
  const result = extractOrderResult(data);

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.orders)) return result.orders;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(data?.payload?.result?.data?.orders)) {
    return data.payload.result.data.orders;
  }

  return result && typeof result === "object" ? [result] : [];
};

const normalizeOrderStatus = (status) => {
  if (!status) return "Pending";
  return String(status)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const normalizeAugmontOrder = (source, order, index = 0) => {
  const amount = pickFirstPositiveNumber(
    order?.totalAmount,
    order?.amount,
    order?.buyPrice,
    order?.sellPrice,
    order?.payableAmount,
    order?.receivableAmount
  );
  const grams = pickFirstPositiveNumber(
    order?.metalQuantity,
    order?.quantity,
    order?.goldAmount,
    order?.grams
  );
  const transactionId =
    order?.transactionId ||
    order?.txnId ||
    order?.transactionID ||
    order?.id ||
    "";
  const merchantTransactionId =
    order?.merchantTransactionId ||
    order?.merchantTxnId ||
    order?.merchantOrderId ||
    "";
  const uniqueId =
    order?.uniqueId || order?.userUniqueId || order?.customerUniqueId || "";
  const status = normalizeOrderStatus(
    order?.status || order?.orderStatus || order?.transactionStatus
  );
  const createdAt =
    order?.createdAt ||
    order?.transactionDate ||
    order?.orderDate ||
    order?.date ||
    order?.updatedAt ||
    "";

  return {
    id:
      merchantTransactionId ||
      transactionId ||
      `${source}-order-${index}`,
    type: source.toUpperCase(),
    amount,
    gold: grams,
    date: createdAt,
    status,
    merchantTransactionId,
    transactionId,
    uniqueId,
    raw: order
  };
};

export const normalizeGoldRatePayload = (data) => {
  const rates =
    data?.payload?.result?.data?.rates ||
    data?.payload?.result?.rates ||
    data?.payload?.rates ||
    data?.rates ||
    {};

  const buyPrice = findRateValue(rates, [
    "gBuy",
    "buy",
    "buyPrice",
    "goldBuy",
    "gold_buy"
  ]);
  const sellPrice = findRateValue(rates, [
    "gSell",
    "sell",
    "sellPrice",
    "goldSell",
    "gold_sell"
  ]);
  const currentPrice = pickFirstPositiveNumber(
    rates?.current,
    rates?.price,
    rates?.goldPrice,
    buyPrice,
    sellPrice
  );

  return {
    currentPrice,
    buyPrice: buyPrice || currentPrice,
    sellPrice: sellPrice || currentPrice,
    metalType: rates?.metalType || "gold",
    updatedAt:
      rates?.updatedAt ||
      rates?.timestamp ||
      data?.payload?.result?.data?.updatedAt ||
      new Date().toISOString(),
    gold: {
      currentPrice,
      buyPrice: buyPrice || currentPrice,
      sellPrice: sellPrice || currentPrice
    },
    silver: {
      currentPrice: findRateValue(rates, [
        "sCurrent",
        "silverCurrent",
        "silverPrice",
        "sPrice"
      ]),
      buyPrice: findRateValue(rates, [
        "sBuy",
        "silverBuy",
        "silver_buy",
        "silverBuyPrice"
      ]),
      sellPrice: findRateValue(rates, [
        "sSell",
        "silverSell",
        "silver_sell",
        "silverSellPrice"
      ])
    },
    rawRates: rates
  };
};

export const normalizeSipRatePayload = (data) => {
  const rates =
    data?.payload?.result?.data?.rates ||
    data?.payload?.result?.rates ||
    data?.payload?.rates ||
    data?.rates ||
    data?.payload?.result?.data ||
    {};

  return {
    gold: {
      currentPrice: findRateValue(rates, [
        "gBuy",
        "goldSipRate",
        "goldRate",
        "buy",
        "buyPrice"
      ]),
      buyPrice: findRateValue(rates, [
        "gBuy",
        "goldSipRate",
        "goldRate",
        "buy",
        "buyPrice"
      ])
    },
    silver: {
      currentPrice: findRateValue(rates, [
        "sBuy",
        "silverSipRate",
        "silverRate",
        "silverBuy"
      ]),
      buyPrice: findRateValue(rates, [
        "sBuy",
        "silverSipRate",
        "silverRate",
        "silverBuy"
      ])
    },
    updatedAt:
      rates?.updatedAt ||
      data?.payload?.result?.data?.updatedAt ||
      new Date().toISOString(),
    rawRates: rates
  };
};

export const normalizeRateHistoryPayload = (data, metalType = "gold") => {
  const source = Array.isArray(data?.payload?.result?.data)
    ? data.payload.result.data
    : [];

  return source
    .map((item) => {
      const buyRate = toNumber(item?.buyRate);
      const sellRate = toNumber(item?.sellRate);

      return {
        date: item?.date || "",
        metalType: item?.type || metalType,
        buyRate,
        sellRate,
        label: item?.date || "",
        price: buyRate || sellRate || 0,
        updatedAt: item?.date || "",
        returns: {
          oneDay: item?.oneDayReturn ?? null,
          oneWeek: item?.oneWeekReturn ?? null,
          oneMonth: item?.oneMonthReturn ?? null,
          threeMonth: item?.threeMonthReturn ?? null,
          sixMonth: item?.sixMonthReturn ?? null,
          nineMonth: item?.nineMonthReturn ?? null,
          oneYear: item?.oneYearReturn ?? null,
          twoYear: item?.twoYearReturn ?? null,
          threeYear: item?.threeYearReturn ?? null,
          fourYear: item?.fourYearReturn ?? null,
          fiveYear: item?.fiveYearReturn ?? null
        },
        raw: item
      };
    })
    .filter((item) => item.buyRate > 0 || item.sellRate > 0);
};

const readGoldRateHistory = () => {
  try {
    const raw = localStorage.getItem(LIVE_GOLD_RATE_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter(
          (point) => point && point.label && Number.isFinite(Number(point.price))
        )
      : [];
  } catch {
    return [];
  }
};

const storeGoldRatePoint = (snapshot) => {
  const history = readGoldRateHistory();
  const timestamp = new Date(snapshot.updatedAt || Date.now());
  const nextPoint = {
    label: timestamp.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    }),
    price: Number(snapshot.currentPrice.toFixed(2)),
    updatedAt: snapshot.updatedAt || timestamp.toISOString()
  };

  const dedupedHistory = history.filter(
    (point) => point.updatedAt !== nextPoint.updatedAt
  );
  const nextHistory = [...dedupedHistory, nextPoint].slice(
    -LIVE_GOLD_RATE_HISTORY_LIMIT
  );

  localStorage.setItem(
    LIVE_GOLD_RATE_HISTORY_KEY,
    JSON.stringify(nextHistory)
  );

  return nextHistory;
};

export const getAugmontSession = () => {
  try {
    const raw = sessionStorage.getItem(AUGMONT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setAugmontSession = (session) => {
  sessionStorage.setItem(AUGMONT_SESSION_KEY, JSON.stringify(session));
};

export const clearAugmontSession = () => {
  sessionStorage.removeItem(AUGMONT_SESSION_KEY);
};

export const getAugmontUser = () => getStoredAugmontUser();
export const setAugmontUser = (user) => setStoredAugmontUser(user);

/* ---------------- AUTH ---------------- */

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return await getJson(res);
};

export const loginAugmont = async ({ force = false } = {}) => {
  if (!force) {
    const existingSession = getAugmontSession();

    if (existingSession?.token && existingSession?.merchantId) {
      return {
        ok: true,
        ...existingSession
      };
    }

    if (AUGMONT_PRODUCTS_TOKEN) {
      const tokenSession = {
        token: AUGMONT_PRODUCTS_TOKEN,
        merchantId: DEFAULT_MERCHANT_ID
      };
      setAugmontSession(tokenSession);
      return {
        ok: true,
        ...tokenSession
      };
    }
  }

  try {
    clearAugmontSession();
    const data = await loginUser(AUGMONT_LOGIN_EMAIL, AUGMONT_LOGIN_PASSWORD);
    const session = extractAugmontSession(data);

    if (!session.token || !session.merchantId) {
      return {
        ok: false,
        message: extractBackendMessage(
          data,
          "Augmont login did not return token or merchantId"
        )
      };
    }

    setAugmontSession(session);

    return {
      ok: true,
      ...session
    };
  } catch (error) {
    console.error("AUGMONT LOGIN ERROR:", error);
    return {
      ok: false,
      message: "Failed to log in to Augmont"
    };
  }
};

export const createUser = async (userData) => {
  const generatedUniqueId =
    userData.uniqueId || `USER-${Date.now()}`;
  const session = await loginAugmont({ force: true });

  if (!session?.ok || !session?.token) {
    return {
      status: "error",
      payload: {
        message: session?.message || "Unable to authenticate with Augmont"
      }
    };
  }

  const res = await fetch(`${BASE_URL}/api/v1/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`
    },
    body: JSON.stringify({
      merchantId: session.merchantId || DEFAULT_MERCHANT_ID,
      request: {
        mobileNumber: userData.mobileNumber || "9999999999",
        emailId: userData.email,
        uniqueId: generatedUniqueId,
        userName: userData.name,
        cityId: "1",
        stateId: "1",
        userPincode: "500001"
      }
    })
  });

  const data = await getJson(res);
  setStoredAugmontUser(extractAugmontUser(data, generatedUniqueId));
  return data;
};

const requestAugmontUserEndpoint = async (path, body) => {
  const session = await loginAugmont();

  if (!session?.ok || !session?.token) {
    return {
      ok: false,
      message: session?.message || "Unable to authenticate with Augmont"
    };
  }

  const requestOnce = async (activeSession) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeSession.token}`
      },
      body: JSON.stringify({
        merchantId: activeSession.merchantId || DEFAULT_MERCHANT_ID,
        ...body
      })
    });

    return {
      res,
      data: await getJson(res)
    };
  };

  let { res, data } = await requestOnce(session);

  if (res.status === 401 || res.status === 403) {
    clearAugmontSession();
    const refreshedSession = await loginAugmont({ force: true });

    if (refreshedSession?.ok && refreshedSession?.token) {
      const retryResult = await requestOnce(refreshedSession);
      res = retryResult.res;
      data = retryResult.data;
    }
  }

  if (!res.ok || data?.status !== "success") {
    return {
      ok: false,
      message: extractBackendMessage(data, "Failed to fetch backend data"),
      raw: data
    };
  }

  return {
    ok: true,
    data,
    raw: data
  };
};

const requestAugmontOrderEndpoint = async (path, body = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        merchantId: body?.merchantId || DEFAULT_MERCHANT_ID,
        ...body
      })
    });

    const data = await getJson(res);

    if (!res.ok || data?.status === "error") {
      return {
        ok: false,
        message: extractBackendMessage(data, "Failed to complete order request"),
        raw: data
      };
    }

    return {
      ok: true,
      data,
      raw: data
    };
  } catch (error) {
    console.error("AUGMONT ORDER API ERROR:", error);
    return {
      ok: false,
      message: "Failed to complete order request"
    };
  }
};

export const fetchAugmontUserProfile = async (uniqueId) => {
  if (!uniqueId) {
    return {
      ok: false,
      message: "Missing Augmont uniqueId"
    };
  }

  const response = await requestAugmontUserEndpoint("/api/v1/users/profile", {
    uniqueId
  });

  if (!response.ok) {
    return response;
  }

  const result =
    response.data?.payload?.result?.data ||
    response.data?.payload?.result ||
    {};

  return {
    ok: true,
    profile: result,
    raw: response.raw
  };
};

export const fetchAugmontPassbook = async (uniqueId) => {
  if (!uniqueId) {
    return {
      ok: false,
      message: "Missing Augmont uniqueId"
    };
  }

  const response = await requestAugmontUserEndpoint("/api/v1/users/passbook", {
    uniqueId
  });

  if (!response.ok) {
    return response;
  }

  const result =
    response.data?.payload?.result?.data ||
    response.data?.payload?.result ||
    {};

  return {
    ok: true,
    passbook: result,
    raw: response.raw
  };
};

/* ---------------- PRODUCTS ---------------- */

export const fetchAugmontProducts = async (
  page = 1,
  count = 10,
  merchantId
) => {
  try {
    const resolvedMerchantId = merchantId || DEFAULT_MERCHANT_ID;

    if (!resolvedMerchantId) {
      return {
        ok: false,
        message: "Missing merchantId. Please retry."
      };
    }

    const res = await fetch(`${BASE_URL}/api/v1/products/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        merchantId: resolvedMerchantId,
        page,
        count
      })
    });

    const data = await getJson(res);

    if (!res.ok || data?.status !== "success") {
      return {
        ok: false,
        message: extractBackendMessage(data, "Failed to fetch products"),
        providerUrl: data?.payload?.providerUrl || "",
        products: [],
        pagination: normalizePagination()
      };
    }

    return {
      ok: true,
      message: data?.payload?.message || "",
      products: Array.isArray(data?.payload?.result?.data)
        ? data.payload.result.data.map(normalizeProduct)
        : [],
      pagination: normalizePagination(data?.payload?.result?.pagination),
      raw: data
    };
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);
    return {
      ok: false,
      message: "Failed to fetch products",
      products: [],
      pagination: normalizePagination()
    };
  }
};

/* ---------------- GOLD RATES ---------------- */

export const getGoldRates = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/rates/live`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    return await getJson(res);
  } catch (error) {
    console.error("AUGMONT LIVE RATE ERROR:", error);
    return {
      ok: false,
      status: "error",
      payload: {
        message: "Failed to fetch live Augmont rates"
      }
    };
  }
};

export const fetchLiveGoldRateSnapshot = async () => {
  try {
    const data = await getGoldRates();
    const snapshot = normalizeGoldRatePayload(data);

    if (snapshot.currentPrice <= 0) {
      return {
        ok: false,
        message: extractBackendMessage(data, "Live gold rate is unavailable"),
        snapshot,
        history: readGoldRateHistory(),
        raw: data
      };
    }

    const history = storeGoldRatePoint(snapshot);
    localStorage.setItem("goldPrice", String(snapshot.currentPrice));

    return {
      ok: true,
      snapshot,
      history,
      raw: data
    };
  } catch (error) {
    console.error("GOLD RATE ERROR:", error);
    return {
      ok: false,
      message: "Failed to fetch live gold rate",
      history: readGoldRateHistory()
    };
  }
};

export const fetchAugmontRateHistory = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  fromDate,
  toDate,
  metalType = "gold"
} = {}) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/rates/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        merchantId,
        fromDate,
        toDate,
        metalType
      })
    });

    const data = await getJson(res);
    const history = normalizeRateHistoryPayload(data, metalType);

    if (!res.ok || history.length === 0) {
      return {
        ok: false,
        history,
        raw: data,
        message: extractBackendMessage(
          data,
          "Historical Augmont rates are unavailable"
        )
      };
    }

    return {
      ok: true,
      history,
      raw: data
    };
  } catch (error) {
    console.error("AUGMONT RATE HISTORY ERROR:", error);
    return {
      ok: false,
      history: [],
      message: "Failed to fetch historical Augmont rates"
    };
  }
};

export const fetchAugmontSipRates = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/rates/sip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    const data = await getJson(res);
    const snapshot = normalizeSipRatePayload(data);

    if (
      !res.ok ||
      (!snapshot.gold.currentPrice && !snapshot.silver.currentPrice)
    ) {
      return {
        ok: false,
        snapshot,
        raw: data,
        message: extractBackendMessage(data, "SIP rates are unavailable")
      };
    }

    return {
      ok: true,
      snapshot,
      raw: data
    };
  } catch (error) {
    console.error("AUGMONT SIP RATE ERROR:", error);
    return {
      ok: false,
      snapshot: {
        gold: { currentPrice: 0, buyPrice: 0 },
        silver: { currentPrice: 0, buyPrice: 0 }
      },
      message: "Failed to fetch SIP rates"
    };
  }
};

/* ---------------- AUGMONT ORDERS ---------------- */

const buildOrderReference = (order, fallback = {}) => {
  const reference = {
    merchantId: String(
      order?.merchantId || fallback?.merchantId || DEFAULT_MERCHANT_ID
    ),
    merchantTransactionId: String(
      order?.merchantTransactionId ||
        order?.merchantTxnId ||
        fallback?.merchantTransactionId ||
        ""
    ),
    transactionId: String(
      order?.transactionId ||
        order?.txnId ||
        order?.transactionID ||
        fallback?.transactionId ||
        ""
    ),
    uniqueId: String(
      order?.uniqueId ||
        order?.userUniqueId ||
        order?.customerUniqueId ||
        fallback?.uniqueId ||
        ""
    )
  };

  storeOrderReference(reference);
  return reference;
};

export const getAugmontOrderReferences = () => getStoredOrderReferences();

export const createAugmontBuyOrder = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  request = {},
  ...rest
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/buy/create", {
    merchantId,
    request,
    ...rest
  });

  if (!response.ok) {
    return response;
  }

  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order, {
    merchantId,
    uniqueId: request?.uniqueId
  });

  return {
    ok: true,
    order,
    references,
    raw: response.raw,
    message:
      response.data?.message ||
      response.data?.payload?.message ||
      "Buy order created successfully"
  };
};

export const fetchAugmontBuyOrderDetail = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  merchantTransactionId,
  uniqueId
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/buy/detail", {
    merchantId,
    merchantTransactionId,
    uniqueId
  });

  if (!response.ok) {
    return response;
  }

  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order, {
    merchantId,
    merchantTransactionId,
    uniqueId
  });

  return {
    ok: true,
    order,
    references,
    raw: response.raw
  };
};

export const fetchAugmontBuyOrders = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  uniqueId
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/buy/list", {
    merchantId,
    uniqueId
  });

  if (!response.ok) {
    return {
      ...response,
      orders: []
    };
  }

  const orders = extractOrderArray(response.data).map((order, index) =>
    normalizeAugmontOrder("buy", order, index)
  );

  return {
    ok: true,
    orders,
    raw: response.raw
  };
};

export const fetchAugmontBuyInvoice = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  transactionId
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/invoices/buy", {
    merchantId,
    transactionId
  });

  if (!response.ok) {
    return response;
  }

  return {
    ok: true,
    invoice: extractOrderResult(response.data),
    raw: response.raw
  };
};

export const createAugmontSellOrder = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  request = {},
  ...rest
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/sell/create", {
    merchantId,
    request,
    ...rest
  });

  if (!response.ok) {
    return response;
  }

  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order, {
    merchantId,
    uniqueId: request?.uniqueId
  });

  return {
    ok: true,
    order,
    references,
    raw: response.raw,
    message: response.data?.payload?.message || "Sell order created successfully"
  };
};

export const fetchAugmontSellOrderDetail = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  merchantTransactionId,
  uniqueId
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/sell/detail", {
    merchantId,
    merchantTransactionId,
    uniqueId
  });

  if (!response.ok) {
    return response;
  }

  const order = extractOrderResult(response.data);
  const references = buildOrderReference(order, {
    merchantId,
    merchantTransactionId,
    uniqueId
  });

  return {
    ok: true,
    order,
    references,
    raw: response.raw
  };
};

export const fetchAugmontSellOrders = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  uniqueId
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/orders/sell/list", {
    merchantId,
    uniqueId
  });

  if (!response.ok) {
    return {
      ...response,
      orders: []
    };
  }

  const orders = extractOrderArray(response.data).map((order, index) =>
    normalizeAugmontOrder("sell", order, index)
  );

  return {
    ok: true,
    orders,
    raw: response.raw
  };
};

export const fetchAugmontSellInvoice = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  transactionId
} = {}) => {
  const response = await requestAugmontOrderEndpoint("/api/v1/invoices/sell", {
    merchantId,
    transactionId
  });

  if (!response.ok) {
    return response;
  }

  return {
    ok: true,
    invoice: extractOrderResult(response.data),
    raw: response.raw
  };
};

export const submitAugmontBuyOrderFlow = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  request = {},
  ...rest
} = {}) => {
  const createResponse = await createAugmontBuyOrder({
    merchantId,
    request,
    ...rest
  });

  if (!createResponse.ok) {
    return createResponse;
  }

  const detailResponse = await fetchAugmontBuyOrderDetail({
    merchantId,
    merchantTransactionId: createResponse.references?.merchantTransactionId,
    uniqueId: createResponse.references?.uniqueId || request?.uniqueId
  });

  return {
    ok: detailResponse.ok,
    create: createResponse,
    detail: detailResponse,
    references: createResponse.references,
    raw: {
      create: createResponse.raw,
      detail: detailResponse.raw
    },
    message:
      detailResponse.message ||
      createResponse.message ||
      "Buy order flow completed"
  };
};

export const submitAugmontSellOrderFlow = async ({
  merchantId = DEFAULT_MERCHANT_ID,
  request = {},
  ...rest
} = {}) => {
  const createResponse = await createAugmontSellOrder({
    merchantId,
    request,
    ...rest
  });

  if (!createResponse.ok) {
    return createResponse;
  }

  const detailResponse = await fetchAugmontSellOrderDetail({
    merchantId,
    merchantTransactionId: createResponse.references?.merchantTransactionId,
    uniqueId: createResponse.references?.uniqueId || request?.uniqueId
  });

  return {
    ok: detailResponse.ok,
    create: createResponse,
    detail: detailResponse,
    references: createResponse.references,
    raw: {
      create: createResponse.raw,
      detail: detailResponse.raw
    },
    message:
      detailResponse.message ||
      createResponse.message ||
      "Sell order flow completed"
  };
};
