// Redirect if not logged in as admin
if (localStorage.getItem("role") !== "admin") {
    alert("Access Denied! Only admins can view this page.");
    window.location.href = "index.html";
}

// Load existing products
let shopItemsData = JSON.parse(localStorage.getItem("shopItemsData")) || [];

// Render products in table
function renderTable() {
    const tableBody = document.querySelector("#productTable tbody");
    tableBody.innerHTML = shopItemsData.map((item, index) => `
        <tr>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.desc}</td>
            <td><img src="${item.img}" width="50"></td>
            <td>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        </tr>
    `).join("");
}
renderTable();

// Add new product
document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let newProduct = {
        id: Date.now().toString(),
        name: document.getElementById("prodName").value,
        price: Number(document.getElementById("prodPrice").value),
        desc: document.getElementById("prodDesc").value,
        img: document.getElementById("prodImg").value
    };
    shopItemsData.push(newProduct);
    localStorage.setItem("shopItemsData", JSON.stringify(shopItemsData));
    renderTable();
    e.target.reset();
});

// Edit product
function editProduct(index) {
    let product = shopItemsData[index];
    let name = prompt("Enter new name", product.name);
    let price = prompt("Enter new price", product.price);
    let desc = prompt("Enter new description", product.desc);
    let img = prompt("Enter new image URL", product.img);
    shopItemsData[index] = { ...product, name, price, desc, img };
    localStorage.setItem("shopItemsData", JSON.stringify(shopItemsData));
    renderTable();
}

// Delete product
function deleteProduct(index) {
    if (confirm("Are you sure?")) {
        shopItemsData.splice(index, 1);
        localStorage.setItem("shopItemsData", JSON.stringify(shopItemsData));
        renderTable();
    }
}

// Logout
function logoutAdmin() {
    localStorage.removeItem("role");
    window.location.href = "index.html";
}
