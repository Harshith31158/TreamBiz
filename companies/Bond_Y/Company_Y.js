// Company_A.js (reads latest price from Sheet2 regularly)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoFYK02R7rVoiu6H1Hxg2yulNobslRKsH2eF1_NvkNpbHO9PdvKeCxANhNA_XnNCbI/exec"; // same URL as main page
const company = "CompanyY";

let price = 376;
let cash = parseInt(localStorage.getItem("cash")) || 100000;
let shares = parseInt(localStorage.getItem(`${company}_shares`)) || 0;

// Elements
const priceEl = document.getElementById("price");
const cashEl  = document.getElementById("cash");
const sharesEl= document.getElementById("shares");
const valueEl = document.getElementById("value");
const qtyEl   = document.getElementById("quantity");
const buyBtn  = document.getElementById("buyBtn");
const sellBtn = document.getElementById("sellBtn");

function updatePortfolioUI() {
  const total = cash + shares * price;
  cashEl.textContent   = `₹${cash}`;
  sharesEl.textContent = shares;
  valueEl.textContent  = `₹${total}`;
}
function setPriceDisplay(p) {
  priceEl.textContent = `₹${p.toFixed(2)}`;
}

async function fetchPriceOnce() {
  try {
    const res = await fetch(`${SCRIPT_URL}?mode=getPrice&company=${encodeURIComponent(company)}`);
    const txt = await res.text();
    const num = parseFloat(txt);
    if (!isNaN(num)) {
      price = num;
      localStorage.setItem(`${company}_price`, String(price));
      setPriceDisplay(price);
      updatePortfolioUI();
    } else {
      console.error("Bad price from server:", txt);
    }
  } catch (err) {
    console.error("fetchPrice error:", err);
  }
}

// poll every 3s for new price
setInterval(fetchPriceOnce, 3000);
fetchPriceOnce();

// Buy / Sell
buyBtn.addEventListener("click", () => {
  const qty = parseInt(qtyEl.value) || 0;
  if (qty <= 0) return alert("Enter a valid number of shares!");

  const cost = qty * price;
  if (cash >= cost) {
    cash -= cost;
    shares += qty;
    localStorage.setItem("cash", String(cash));
    localStorage.setItem(`${company}_shares`, String(shares));
    updatePortfolioUI();
  } else {
    alert("Not enough cash!");
  }
});

sellBtn.addEventListener("click", () => {
  const qty = parseInt(qtyEl.value) || 0;
  if (qty <= 0) return alert("Enter a valid number of shares!");
  if (shares < qty) return alert("You don't own that many shares!");

  const revenue = qty * price;
  cash += revenue;
  shares -= qty;
  localStorage.setItem("cash", String(cash));
  localStorage.setItem(`${company}_shares`, String(shares));
  updatePortfolioUI();
});

// Ensure UI shows something on first load
updatePortfolioUI();
