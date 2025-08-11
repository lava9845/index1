// app.js (ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

/* --------------- PASTE YOUR FIREBASE CONFIG HERE --------------- */
const firebaseConfig = {
  apiKey: "AIzaSyD-Okdkn23DU64p8VwxCusCi15J78vhknA",
  authDomain: "shopping-cart-651ff.firebaseapp.com",
  projectId: "shopping-cart-651ff",
  storageBucket: "shopping-cart-651ff.firebasestorage.app",
  messagingSenderId: "812115070677",
  appId: "1:812115070677:web:898e0bca6400b5f7475c5c",
  measurementId: "G-BX34YK3CF8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const searchInput = document.getElementById('searchInput');
const itemsGrid = document.getElementById('items-grid');
const adminPanel = document.getElementById('admin-panel');
const adminItems = document.getElementById('admin-items');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const btnCart = document.getElementById('btn-cart');
const cartCount = document.getElementById('cart-count');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const authModal = new bootstrap.Modal(document.getElementById('authModal'));

let currentUser = null;
let isAdmin = false;
let itemsCache = []; // in-memory cache for search

/* ---------- Helper: show alerts ---------- */
function showAlert(text, type='info', timeout=3000){
  const id = 'a'+Date.now();
  const html = `
    <div id="${id}" class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${text}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  document.getElementById('alert-placeholder').insertAdjacentHTML('beforeend', html);
  if(timeout) setTimeout(()=>document.getElementById(id)?.remove(), timeout);
}

/* ---------- AUTH: signup / login / state listener ---------- */
document.getElementById('btn-do-signup').addEventListener('click', async ()=>{
  const email = document.getElementById('email').value.trim();
  const pw = document.getElementById('password').value;
  if(!email || !pw){ showAlert('Email + password required', 'warning'); return; }
  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    // create a user doc with default role
    await setDoc(doc(db,'users', cred.user.uid), { email, role: 'user', createdAt: Date.now() });
    showAlert('Signup successful — welcome!', 'success');
    authModal.hide();
  }catch(err){ showAlert(err.message, 'danger'); }
});

document.getElementById('btn-do-login').addEventListener('click', async ()=>{
  const email = document.getElementById('email').value.trim();
  const pw = document.getElementById('password').value;
  try{
    await signInWithEmailAndPassword(auth, email, pw);
    showAlert('Login successful', 'success');
    authModal.hide();
  }catch(err){ showAlert(err.message, 'danger'); }
});

btnLogin.addEventListener('click', ()=> authModal.show());
btnLogout.addEventListener('click', async ()=>{
  await signOut(auth);
  showAlert('Logged out', 'info');
});

/* auth state */
onAuthStateChanged(auth, async (user)=>{
  currentUser = user;
  if(user){
    btnLogin.classList.add('d-none'); btnLogout.classList.remove('d-none');
    // check admin collection existence
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    isAdmin = adminDoc.exists();
    adminPanel.classList.toggle('d-none', !isAdmin);
    if(isAdmin) showAlert('Admin mode active', 'info');
    // update cart count from Firestore orders/cart etc (for simplicity we keep local cart)
    updateCartCount();
  } else {
    btnLogin.classList.remove('d-none'); btnLogout.classList.add('d-none');
    adminPanel.classList.add('d-none');
    isAdmin = false;
    currentUser = null;
    updateCartCount();
  }
});

/* ---------- ITEMS: read (visible) and admin view ---------- */
async function loadItems(){
  const q = query(collection(db, 'items'), orderBy('name'));
  const snapshot = await getDocs(q);
  const items = [];
  snapshot.forEach(docSnap=>{
    const data = docSnap.data();
    data.id = docSnap.id;
    items.push(data);
  });
  itemsCache = items; // keep for search
  renderCatalog(items.filter(i=>i.isVisible === true || i.isVisible === 'true'));
  renderAdminItems(items);
}
loadItems();

/* re-load on changes (simple polling alternative: onSnapshot) */
onSnapshot(collection(db,'items'), (snap)=> loadItems());

function renderCatalog(items){
  itemsGrid.innerHTML = '';
  if(!items.length) {
    itemsGrid.innerHTML = '<div class="col-12 text-muted">No items found.</div>';
    return;
  }
  items.forEach(it=>{
    const img = it.image || 'https://via.placeholder.com/600x400?text=No+Image';
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card card-item h-100">
        <img src="${img}" class="card-img-top" alt="${escapeHtml(it.name)}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title mb-1">${escapeHtml(it.name)}</h6>
          <p class="small text-muted mb-2">${truncate(it.description || '', 80)}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <strong>₹${Number(it.price).toFixed(2)}</strong>
            <div>
              <button class="btn btn-sm btn-outline-primary me-1" data-id="${it.id}" onclick="addToCartHandler(event)">Add</button>
              <button class="btn btn-sm btn-primary" data-id="${it.id}" onclick="buyNowHandler(event)">Buy</button>
            </div>
          </div>
        </div>
      </div>`;
    itemsGrid.appendChild(col);
  });
}

/* admin view (all items) */
function renderAdminItems(items){
  adminItems.innerHTML = '';
  if(!items.length){ adminItems.innerHTML = '<div class="text-muted">No items</div>'; return; }
  items.forEach(it=>{
    const div = document.createElement('div');
    div.className = 'col-md-4';
    div.innerHTML = `
      <div class="card p-2">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <b>${escapeHtml(it.name)}</b> <div class="small text-muted">₹${Number(it.price).toFixed(2)}</div>
            <div class="small text-muted">${it.isVisible ? 'Visible' : 'Hidden'}</div>
          </div>
          <div class="text-end">
            <button class="btn btn-sm btn-outline-secondary mb-1" data-id="${it.id}" onclick="editItem('${it.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteItem('${it.id}')">Delete</button>
          </div>
        </div>
      </div>`;
    adminItems.appendChild(div);
  });
}

/* ---------- ADMIN: create/update/delete items ---------- */
document.getElementById('save-item').addEventListener('click', async (e)=>{
  e.preventDefault();
  const id = document.getElementById('item-id').value;
  const name = document.getElementById('item-name').value.trim();
  const price = Number(document.getElementById('item-price').value);
  const image = document.getElementById('item-image').value.trim();
  const visible = document.getElementById('item-visible').value === 'true';
  if(!name || !price){ showAlert('Name and price required', 'warning'); return; }
  try{
    if(id){
      await updateDoc(doc(db,'items',id), { name, price, image, isVisible: visible });
      showAlert('Item updated', 'success');
    } else {
      await addDoc(collection(db,'items'), { name, price, image, description:'', isVisible: visible });
      showAlert('Item created', 'success');
    }
    document.getElementById('item-form').reset();
  }catch(err){ showAlert(err.message, 'danger'); }
});

document.getElementById('clear-item').addEventListener('click', ()=> {
  document.getElementById('item-id').value = '';
  document.getElementById('item-form').reset();
});

window.editItem = async (id)=>{
  const d = await getDoc(doc(db,'items',id));
  if(!d.exists()) return showAlert('Not found', 'warning');
  const data = d.data();
  document.getElementById('item-id').value = id;
  document.getElementById('item-name').value = data.name || '';
  document.getElementById('item-price').value = data.price || '';
  document.getElementById('item-image').value = data.image || '';
  document.getElementById('item-visible').value = data.isVisible ? 'true' : 'false';
};

window.deleteItem = async (id)=>{
  if(!confirm('Delete this item?')) return;
  await deleteDoc(doc(db,'items',id));
  showAlert('Deleted', 'info');
};

/* ---------- SEARCH ---------- */
searchInput.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q) renderCatalog(itemsCache.filter(i=>i.isVisible == true || i.isVisible == 'true'));
  else {
    const results = itemsCache.filter(it=>{
      return (it.isVisible == true || it.isVisible == 'true') &&
             (it.name.toLowerCase().includes(q) || (it.description||'').toLowerCase().includes(q));
    });
    renderCatalog(results);
  }
});

/* ---------- CART (simple localStorage cart, merged on login can be added) ---------- */
function getCart(){
  try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(e){ return []; }
}
function saveCart(cart){ localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }

function updateCartCount(){
  const c = getCart(); cartCount.textContent = c.reduce((s,i)=>s+i.qty,0);
}

window.addToCartHandler = (ev)=>{
  const id = ev.currentTarget.dataset.id;
  const item = itemsCache.find(x=>x.id===id);
  if(!item){ showAlert('Item not found', 'warning'); return; }
  const cart = getCart();
  const found = cart.find(i=>i.id === id);
  if(found) found.qty++;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, image: item.image });
  saveCart(cart);
  showAlert('Added to cart', 'success');
};

window.buyNowHandler = (ev)=>{
  const id = ev.currentTarget.dataset.id;
  if(!currentUser){
    // redirect to signup/login modal, then proceed after login.
    showAlert('Please login/signup to buy — opening auth modal', 'info');
    authModal.show();
    // store desired buy action
    sessionStorage.setItem('afterAuthBuy', id);
    return;
  }
  // add to cart and open cart modal
  const item = itemsCache.find(x=>x.id===id);
  const cart = getCart();
  const found = cart.find(i=>i.id === id);
  if(found) found.qty++;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, image: item.image });
  saveCart(cart);
  cartModal.show();
};

btnCart.addEventListener('click', ()=>{
  renderCartModal();
  cartModal.show();
});

function renderCartModal(){
  const cart = getCart();
  const body = document.getElementById('cart-body');
  if(!cart.length){ body.innerHTML = '<div class="text-muted">Your cart is empty</div>'; return; }
  const rows = cart.map(ci=>`
    <div class="d-flex align-items-center gap-3 mb-3">
      <img src="${ci.image||'https://via.placeholder.com/80'}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;">
      <div class="flex-grow-1">
        <div><strong>${escapeHtml(ci.name)}</strong></div>
        <div class="small text-muted">₹${Number(ci.price).toFixed(2)} x ${ci.qty}</div>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty('${ci.id}', -1)">-</button>
        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty('${ci.id}', 1)">+</button>
        <button class="btn btn-sm btn-danger" onclick="removeFromCart('${ci.id}')">Remove</button>
      </div>
    </div>
  `).join('');
  body.innerHTML = rows + `<hr><div class="text-end"><strong>Total: ₹${cart.reduce((s,c)=>s+(c.price*c.qty),0).toFixed(2)}</strong></div>`;
}

window.changeQty = (id, delta)=>{
  const cart = getCart();
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(0, it.qty + delta);
  if(it.qty === 0) {
    const idx = cart.findIndex(i=>i.id===id);
    cart.splice(idx,1);
  }
  saveCart(cart);
  renderCartModal();
};

window.removeFromCart = (id)=>{
  const cart = getCart().filter(i=>i.id !== id);
  saveCart(cart);
  renderCartModal();
};

/* ---------- PLACE ORDER (stores in Firestore) ---------- */
document.getElementById('place-order').addEventListener('click', async ()=>{
  if(!currentUser){ showAlert('Please login/signup first', 'warning'); authModal.show(); return; }
  const cart = getCart();
  if(!cart.length) { showAlert('Cart empty', 'warning'); return; }
  try{
    const order = {
      userId: currentUser.uid,
      items: cart,
      total: cart.reduce((s,c)=>s+(c.price*c.qty),0),
      createdAt: Date.now(),
      status: 'placed'
    };
    await addDoc(collection(db, 'orders'), order);
    localStorage.removeItem('cart');
    updateCartCount();
    cartModal.hide();
    showAlert('Order placed — thank you!', 'success');
  }catch(err){ showAlert(err.message, 'danger'); }
});

/* ---------- AFTER LOGIN: check sessionStorage if user attempted to buy ---------- */
onAuthStateChanged(auth, (user)=>{
  if(user){
    const buyId = sessionStorage.getItem('afterAuthBuy');
    if(buyId){
      // add to cart and open cart modal
      const item = itemsCache.find(x=>x.id === buyId);
      if(item){
        const cart = getCart();
        const found = cart.find(i=>i.id === buyId);
        if(found) found.qty++;
        else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, image: item.image });
        saveCart(cart);
        renderCartModal();
        cartModal.show();
      }
      sessionStorage.removeItem('afterAuthBuy');
    }
  }
});

/* ---------- VIEW USER ORDERS (simple function — you can add a page) ---------- */
async function loadUserOrders(){
  if(!currentUser) return [];
  const q = query(collection(db,'orders'), where('userId','==', currentUser.uid), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(s=> out.push({ id: s.id, ...s.data() }));
  return out;
}

/* ---------- UTILS ---------- */
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function truncate(s, n=60){ return s.length>n ? s.slice(0,n-1)+'…' : s; }

/* expose a couple helpers to window for inline onclicks */
window.addToCartHandler = window.addToCartHandler;
window.buyNowHandler = window.buyNowHandler;
window.editItem = window.editItem;
window.deleteItem = window.deleteItem;
window.changeQty = window.changeQty;
window.removeFromCart = window.removeFromCart;
