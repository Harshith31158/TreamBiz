// === MAIN PAGE JS ===

// Google Apps Script endpoint
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoFYK02R7rVoiu6H1Hxg2yulNobslRKsH2eF1_NvkNpbHO9PdvKeCxANhNA_XnNCbI/exec";

// List of companies
const companies = ["CompanyA", "CompanyB", "CompanyC", "CompanyD", "CompanyE","CompanyX","CompanyY","FundAlpha","FundZ","FundBeta"];

// Initialize cash if not already set
if (!localStorage.getItem("cash")) {
  localStorage.setItem("cash", "10000");
}

// Freeze/unfreeze helper
function setFreezeState(isFrozen) {
  const buttons = document.querySelectorAll("button");
  const inputs = document.querySelectorAll("input");
  buttons.forEach(btn => btn.disabled = isFrozen);
  inputs.forEach(inp => inp.disabled = isFrozen);
  document.body.style.opacity = isFrozen ? "0.5" : "1"; // visual effect
}

// Poll for new price for a single company
function waitForNewPrice(company, oldPrice) {
  const interval = setInterval(() => {
    fetch(`${SCRIPT_URL}?mode=getPrice&company=${company}`)
      .then(res => res.text())
      .then(price => {
        if (parseFloat(price) !== parseFloat(oldPrice)) {
          clearInterval(interval);
          document.getElementById(`${company}-price`).innerText = price; // update UI
        }
      })
      .catch(err => console.error(err));
  }, 3000);
}

// Fetch current prices for all companies
function handleSubmit() {
  setFreezeState(true);

  companies.forEach(company => {
    fetch(`${SCRIPT_URL}?mode=getPrice&company=${company}`)
      .then(res => res.text())
      .then(oldPrice => {
        waitForNewPrice(company, oldPrice); // start polling for changes
      })
      .catch(err => console.error(err));
  });

  // Optionally unfreeze after initial fetch for better UX
  setFreezeState(false);
}
