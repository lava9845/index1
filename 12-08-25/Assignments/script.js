let items = JSON.parse(localStorage.getItem('items') || '[]');
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let orders = JSON.parse(localStorage.getItem('orders') || '[]');
let isAdmin = false;
let editIndex = null;

function saveData() {
  localStorage.setItem('items', JSON.stringify(items));
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('orders', JSON.stringify(orders));
}

function toggleAdmin() {
  if (!isAdmin) {
    let pass = prompt("Enter admin password:");
    if (pass === "admin123") { 
      isAdmin = true; 
      document.getElementById('adminPanel').style.display = 'block'; 
      renderAdminTable(); 
      renderOrders(); 
    }
    else alert("Wrong password");
  } else {
    isAdmin = false; 
    document.getElementById('adminPanel').style.display = 'none';
  }
}

function saveItem() {
  let name = document.getElementById('itemName').value.trim();
  let price = parseFloat(document.getElementById('itemPrice').value);
  let img = document.getElementById('itemImage').value.trim() || "https://via.placeholder.com/150";
  if (!name || !price) return alert("Fill all fields");
  if (editIndex !== null) { items[editIndex] = {name, price, img}; editIndex = null; }
  else items.push({name, price, img});
  saveData(); renderItems(); renderAdminTable();
}

function editItem(i) {
  let item = items[i];
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemPrice').value = item.price;
  document.getElementById('itemImage').value = item.img;
  editIndex = i;
}

function deleteItem(i) {
  if (confirm("Delete item?")) { 
    items.splice(i,1); 
    saveData(); 
    renderItems(); 
    renderAdminTable(); 
  }
}

function renderAdminTable() {
  let html = "";
  items.forEach((it,i)=>{
    html += `<tr><td>${it.name}</td><td>₹${it.price}</td>
             <td><button onclick="editItem(${i})">Edit</button>
                 <button onclick="deleteItem(${i})">Delete</button></td></tr>`;
  });
  document.getElementById('adminTable').innerHTML = html;
}

function renderItems() {
  let search = document.getElementById('searchBox').value.toLowerCase();
  let html = "";
  items.filter(it=>it.name.toLowerCase().includes(search)).forEach((it,i)=>{
    html += `<div class="card">
               <img src="${it.img}">
               <h4>${it.name}</h4>
               <div class="price">₹${it.price}</div>
               <button onclick="addToCart(${i})">Add to Cart</button>
             </div>`;
  });
  document.getElementById('itemsGrid').innerHTML = html;
}

function addToCart(i) {
  let item = items[i];
  let existing = cart.find(c=>c.name===item.name);
  if (existing) existing.qty++;
  else cart.push({...item, qty: 1});
  saveData(); updateCartCount();
}

function updateCartCount() {
  document.getElementById('cartCount').innerText = cart.reduce((a,c)=>a+c.qty,0);
}

function showCart() {
  document.getElementById('cartModal').style.display = 'flex';
  renderCart();
}

function closeCart() { 
  document.getElementById('cartModal').style.display = 'none'; 
}

function renderCart() {
  let html = "";
  let total = 0;
  cart.forEach((c,i)=>{
    total += c.price * c.qty;
    html += `<div class="cart-item">
               <span>${c.name} - ₹${c.price} x ${c.qty}</span>
               <span>
                 <button class="qty-btn" onclick="changeQty(${i},-1)">–</button>
                 <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
               </span>
             </div>`;
  });
  document.getElementById('cartItems').innerHTML = html || "<p>Cart is empty</p>";
  document.getElementById('cartTotal').innerText = total;
}

function changeQty(i, delta) {
  cart[i].qty += delta;
  if (cart[i].qty <= 0) cart.splice(i,1);
  saveData(); renderCart(); updateCartCount();
}

function placeOrder() {
  if (!cart.length) return alert("Cart is empty");
  orders.push({date: new Date().toLocaleString(), items: cart});
  cart = [];
  saveData();
  updateCartCount();
  renderCart();
  alert("Order placed!");
  if (isAdmin) renderOrders();
}

function renderOrders() {
  let html = "";
  orders.forEach(o=>{
    html += `<div><strong>${o.date}</strong><ul>`;
    o.items.forEach(it=>{ html += `<li>${it.name} x ${it.qty}</li>`; });
    html += "</ul></div>";
  });
  document.getElementById('ordersList').innerHTML = html || "<p>No orders yet</p>";
}

renderItems();
updateCartCount();
