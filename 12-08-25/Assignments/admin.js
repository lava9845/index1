
let items = JSON.parse(localStorage.getItem('items') || '[]');
let orders = JSON.parse(localStorage.getItem('orders') || '[]');
let editIndex = null;

function saveData() {
  localStorage.setItem('items', JSON.stringify(items));
  localStorage.setItem('orders', JSON.stringify(orders));
}

function saveItem() {
  let name = document.getElementById('itemName').value.trim();
  let price = parseFloat(document.getElementById('itemPrice').value);
  let img = document.getElementById('itemImage').value.trim() || "https://via.placeholder.com/150";
  if (!name || !price) return alert("Fill all fields");
  
  if (editIndex !== null) {
    items[editIndex] = {name, price, img};
    editIndex = null;
  } else {
    items.push({name, price, img});
  }
  saveData();
  renderAdminTable();
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemImage').value = '';
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
    items.splice(i, 1);
    saveData();
    renderAdminTable();
  }
}

function renderAdminTable() {
  let html = "";
  items.forEach((it, i) => {
    html += `<tr>
      <td>${it.name}</td>
      <td>₹${it.price}</td>
      <td>
        <button onclick="editItem(${i})">Edit</button>
        <button onclick="deleteItem(${i})">Delete</button>
      </td>
    </tr>`;
  });
  document.getElementById('adminTable').innerHTML = html;
}

function renderOrders() {
  let html = "";
  orders.forEach(o => {
    html += `<div><strong>${o.date}</strong><ul>`;
    o.items.forEach(it => {
      html += `<li>${it.name} x ${it.qty}</li>`;
    });
    html += "</ul></div>";
  });
  document.getElementById('ordersList').innerHTML = html || "<p>No orders yet</p>";
}

function logout() {
  window.location.href = "user.html";
}

renderAdminTable();
renderOrders();
