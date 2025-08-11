let shop=document.getElementById('shop');
let shopItemsData=[{
    id:"123",
    name:"Casual Top",
    price:150,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img1.jpg"
    },
    {
    id:"234",
    name:"Cotton Top",
    price:200,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img2.jpg"
    },
    {
    id:"345",
    name:"Office Top",
    price:280,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img3.jpg"   
    },
    {
    id:"456",
    name:"T-shirt",
    price:120,
    desc:"Lorem ipsum dolor sit amet consectetur.",
    img:"images/img4.jpg"      
    },
];
let basket = JSON.parse(localStorage.getItem("basket")) || [];
let generateShop=()=>{
    return (shop.innerHTML=shopItemsData.map((x)=>{
        let{id,name,price,desc,img}=x;
        return `
           <div id=product-id-${id} class="item">
        <img width="218" src=${img} alt="">
        <div class="details">
            <h3>${name}</h3>
            <p>${desc}</p>
            <div class="price-quantity"></div>
            <h2>$ ${price}</h2>
            <div class="button">
                <i onclick="decrement()" class="bi bi-dash-lg"></i>
                 <div id=${id} class="quantity">0</div>
                 <i onclick="increment()" class="bi bi-plus-lg"></i>
            </div>
        </div>
    </div>
    `})
.join(""));
}
generateShop();
document.getElementById("orderBtn").addEventListener("click", placeOrder);

async function placeOrder() {
  let user = firebase.auth().currentUser;
  if (!user) {
    window.location.href = "signup.html"; // redirect if not logged in
    return;
  }

  if (basket.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let order = {
    userId: user.uid,
    items: basket,
    date: new Date(),
    status: "Pending"
  };

  try {
    await db.collection("orders").add(order);
    alert("Order placed successfully!");
    basket = [];
    localStorage.setItem("data", JSON.stringify(basket));
    generateCartItems(); // refresh cart UI
  } catch (error) {
    console.error("Error placing order:", error);
  }
}
let increment = (id) => {
  let search = basket.find((x) => x.id === id);

  if (search === undefined) {
    basket.push({ id: id, item: 1 });
  } else {
    search.item += 1;
  }

  update(id);
  localStorage.setItem("basket", JSON.stringify(basket));
};
let decrement = (id) => {
  let search = basket.find((x) => x.id === id);

  if (search === undefined || search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(id);
  localStorage.setItem("basket", JSON.stringify(basket));
};
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  let quantityEl = document.getElementById(id);
  if (quantityEl) {
    quantityEl.innerHTML = search.item;
  }
};
let isLoggedIn = false;
const adminEmail = "admin@store.com";
const adminUser = "admin";
function loginUser() {
    if (!isLoggedIn) {
        let username = prompt("Enter your username:");
    if (!username) return;
        let email = prompt("Enter your email:");
        if (!email || !validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        isLoggedIn = true;
        document.getElementById("loginBtn").innerText = "Logout";
        alert(`Welcome, ${username}! Your email: ${email}`);
         if (username.toLowerCase() === adminUser && email.toLowerCase() === adminEmail) {
            document.getElementById("adminPageLink").style.display = "inline-block";
            localStorage.setItem("role", "admin");
        } else {
            localStorage.setItem("role", "user");
        }
    } else {
        isLoggedIn = false;
        document.getElementById("loginBtn").innerText = "Login";
        document.getElementById("adminPageLink").style.display = "none";
        localStorage.removeItem("role");
        alert("You have been logged out.");
    }
}
function validateEmail(email) {
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function searchItems() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let filteredData = shopItemsData.filter(item =>
        item.name.toLowerCase().includes(query)
    );
    shop.innerHTML = filteredData.map((x) => {
        let { id, name, price, desc, img } = x;
        let search = basket.find((item) => item.id === id) || { item: 0 };
        return `
        <div id=product-id-${id} class="item">
            <img width="218" src=${img} alt="">
            <div class="details">
                <h3>${name}</h3>
                <p>${desc}</p>
                <h2>$ ${price}</h2>
                <div class="button">
                    <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
                    <div id=${id} class="quantity">${search.item}</div>
                    <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
                </div>
            </div>
        </div>
        `;
    }).join("");
}

