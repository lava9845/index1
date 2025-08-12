import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getDoc,
  doc,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM elements
const loginPopup = document.getElementById("loginPopup");
const loginBtn = document.getElementById("loginBtn");
const loginSubmit = document.getElementById("loginSubmit");
const loginCancel = document.getElementById("loginCancel");
const searchInput = document.getElementById("searchInput");
const adminLink = document.getElementById("adminPageLink");
const cartAmount = document.querySelector(".cartAmount");
const orderBtn = document.getElementById("orderBtn");

let cart = [];

// ================== LOGIN FUNCTION ==================
loginBtn.addEventListener("click", () => {
  loginPopup.style.display = "block";
});

// Close login popup
loginCancel.addEventListener("click", () => {
  loginPopup.style.display = "none";
});

// Login submit
loginSubmit.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    loginPopup.style.display = "none";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

// Auth state check
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().role === "admin") {
      adminLink.style.display = "inline-block";
    }
    loginBtn.textContent = "Logout";
    loginBtn.onclick = logoutUser;
  } else {
    adminLink.style.display = "none";
    loginBtn.textContent = "Login";
    loginBtn.onclick = () => loginPopup.style.display = "block";
  }
});

function logoutUser() {
  signOut(auth).then(() => {
    alert("Logged out");
  });
}

  // Check role in Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists() && userDoc.data().role === "admin") {
    adminLink.style.display = "inline-block";
  } else {
    adminLink.style.display = "none";
  }


// ================== SEARCH FUNCTION ==================
window.searchItems = function () {
  const filter = searchInput.value.toLowerCase();
  const items = document.querySelectorAll(".shop .item");
  items.forEach((item) => {
    const name = item.querySelector("h3").textContent.toLowerCase();
    item.style.display = name.includes(filter) ? "block" : "none";
  });
};

// ================== CART FUNCTIONALITY ==================
document.querySelectorAll(".bi-plus-lg").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    cart[index] = (cart[index] || 0) + 1;
    updateCartUI();
  });
});

document.querySelectorAll(".bi-dash-lg").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (cart[index] > 0) {
      cart[index]--;
    }
    updateCartUI();
  });
});

function updateCartUI() {
  const quantities = document.querySelectorAll(".quantity");
  let total = 0;
  cart.forEach((qty, i) => {
    quantities[i].textContent = qty || 0;
    total += qty || 0;
  });
  cartAmount.textContent = total;
}

// ================== PLACE ORDER ==================
orderBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to place an order.");
    return;
  }

  const items = [];
  document.querySelectorAll(".item").forEach((item, index) => {
    const qty = cart[index] || 0;
    if (qty > 0) {
      items.push({
        name: item.querySelector("h3").textContent,
        price: parseFloat(item.querySelector("h2").textContent.replace("$", "")),
        quantity: qty
      });
    }
  });

  if (items.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userEmail: user.email,
      items,
      timestamp: new Date()
    });
    alert("Order placed successfully!");
    cart = [];
    updateCartUI();
  } catch (error) {
    alert("Error placing order: " + error.message);
  }
});

// ================== LOGOUT (OPTIONAL) ==================
window.logoutUser = function () {
  signOut(auth).then(() => {
    alert("Logged out");
  });
};
