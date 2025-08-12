import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // ================== ADMIN AUTH CHECK ==================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    alert("Access denied");
    window.location.href = "index.html";
  } else {
    loadProducts();
    loadOrders();
  }
});

// ================== ADD PRODUCT ==================
document.getElementById("addItemForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const image = document.getElementById("itemImage").value.trim();

  if (!name || !price || !image) {
    alert("All fields are required!");
    return;
  }

  await addDoc(collection(db, "products"), { name, price, image });
  alert("Product added successfully!");
  e.target.reset();
  loadProducts();
});

// ================== LOAD PRODUCTS ==================
async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    productList.innerHTML += `
      <div style="display:flex;align-items:center;margin-bottom:10px;gap:10px;">
        <img src="${data.image}" width="60" height="60" style="object-fit:cover;">
        <strong>${data.name}</strong> - $${data.price}
        <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
      </div>
    `;
  });
}

// ================== DELETE PRODUCT ==================
window.deleteProduct = async function(id) {
  await deleteDoc(doc(db, "products", id));
  loadProducts();
};

// ================== LOAD ORDERS ==================
async function loadOrders() {
  const querySnapshot = await getDocs(collection(db, "orders"));
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    orderList.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;">
        <strong>User:</strong> ${data.userEmail}<br>
        <strong>Items:</strong> ${data.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
      </div>
    `;
  });
}

// ================== LOGOUT ==================
window.logoutUser = function() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
