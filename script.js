const cart = {}; 

const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart');
const searchInput = document.getElementById('search');

function formatPrice(n) {
  return '₱' + n.toFixed(2);
}

function updateCartUI() {
  cartItemsEl.innerHTML = '';
  let total = 0;
  let itemCount = 0;

  for (const name in cart) {
    const item = cart[name];
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    itemCount += item.qty;

    const li = document.createElement('li');

    li.innerHTML = `
      <div class="item-info" style="display:flex;align-items:center;gap:10px;">
        <img src="${item.img}" alt="${name}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
        <div>
          <div class="name">${name}</div>
          <div class="meta">${formatPrice(item.price)} × ${item.qty} = ${formatPrice(itemTotal)}</div>
        </div>
      </div>
      <div class="item-actions">
        <div class="qty-btns">
          <button class="small-btn decrease" data-name="${name}">−</button>
          <button class="small-btn increase" data-name="${name}">+</button>
        </div>
        <button class="remove-btn" data-name="${name}">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  }

  cartTotalEl.textContent = formatPrice(total);
  cartCountEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
  checkoutBtn.disabled = itemCount === 0;
}

document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const p = e.target.closest('.product');
    const name = p.dataset.name;
    const price = parseFloat(p.dataset.price) || 0;
    const img = p.querySelector('img').src; 

    if (cart[name]) {
      cart[name].qty += 1;
    } else {
      cart[name] = { price: price, qty: 1, img: img };
    }

    updateCartUI();

    btn.textContent = 'Added ✓';
    setTimeout(() => btn.textContent = 'Add to cart', 900);
  });
});

cartItemsEl.addEventListener('click', e => {
  const name = e.target.dataset.name;
  if (!name) return;

  if (e.target.classList.contains('remove-btn')) {
    delete cart[name];
    updateCartUI();
    return;
  }
  if (e.target.classList.contains('increase')) {
    cart[name].qty += 1;
    updateCartUI();
    return;
  }
  if (e.target.classList.contains('decrease')) {
    cart[name].qty -= 1;
    if (cart[name].qty <= 0) delete cart[name];
    updateCartUI();
    return;
  }
});

clearCartBtn.addEventListener('click', () => {
  for (const k in cart) delete cart[k];
  updateCartUI();
});

checkoutBtn.addEventListener('click', () => {
  alert('Checkout Successfull!. Total: ' + cartTotalEl.textContent);
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  document.querySelectorAll('.product').forEach(p => {
    const dataName = p.dataset.name.toLowerCase();
    const visibleName = p.querySelector('h3').textContent.toLowerCase();
    p.style.display = (dataName.includes(q) || visibleName.includes(q)) ? "" : "none";
  });
});
