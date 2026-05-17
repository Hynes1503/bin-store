const PRODUCTS = [
  {
    id: 1,
    name: "Air Force 1 '07 Tech ESS",
    price: 3239000,
    brand: "Nike",
    color: "Trắng/Xanh navy",
    desc: "Thiết kế tối giản, da mềm và kiểu dáng cổ điển dễ phối đồ.",
  },
  {
    id: 2,
    name: "Jordan CMFT Era",
    price: 3519000,
    brand: "Jordan",
    color: "Kem/Đen",
    desc: "Dáng Jordan hiện đại, đệm êm và phong cách streetwear.",
  },
  {
    id: 3,
    name: "Jordan MVP 92",
    price: 4259000,
    brand: "Jordan",
    color: "Kem/Nâu",
    desc: "Form chắc chắn, phối màu trung tính phù hợp đi học và đi chơi.",
  },
  {
    id: 4,
    name: "Nike Pegasus Premium",
    price: 6179000,
    brand: "Nike",
    color: "Xanh neon",
    desc: "Đệm khí nổi bật, cảm giác chuyển động linh hoạt.",
  },
  {
    id: 5,
    name: "Tiempo Streetgato SE",
    price: 3649000,
    brand: "Nike",
    color: "Trắng/Xám",
    desc: "Mẫu sneaker nhẹ, bền, phù hợp sử dụng hằng ngày.",
  },
  {
    id: 6,
    name: "Air Jordan 1 Mid SE",
    price: 3959000,
    brand: "Jordan",
    color: "Đen/Kem",
    desc: "Biểu tượng Jordan cổ cao, phối màu mạnh mẽ.",
  },
  {
    id: 7,
    name: "Air Jordan Legacy 312 Low",
    price: 3620149,
    brand: "Jordan",
    color: "Trắng/Đen",
    desc: "Sự kết hợp giữa retro và hiện đại.",
  },
  {
    id: 8,
    name: "Air Max 90 (GS)",
    price: 2935199,
    brand: "Nike",
    color: "Xám/Xanh",
    desc: "Air Max 90 kinh điển, êm và nổi bật.",
  },
  {
    id: 9,
    name: "Nike ACG Izy SE",
    price: 3829000,
    brand: "Nike",
    color: "Hồng be",
    desc: "Phong cách outdoor nhẹ, chất liệu thoải mái.",
  },
  {
    id: 10,
    name: "Adidas Ultraboost 22",
    price: 2450000,
    brand: "Adidas",
    color: "Đen/Trắng",
    desc: "Đệm Boost êm, hỗ trợ chạy bộ và di chuyển hằng ngày.",
  },
  {
    id: 11,
    name: "New Balance 574 Classic",
    price: 1620000,
    brand: "New Balance",
    color: "Navy",
    desc: "Dáng 574 cổ điển, dễ phối đồ và bền bỉ.",
  },
  {
    id: 12,
    name: "Vans Old Skool Classic",
    price: 1250000,
    brand: "Vans",
    color: "Đen/Trắng",
    desc: "Mẫu Vans kinh điển với sọc side stripe nổi bật.",
  },
  {
    id: 13,
    name: "Puma Suede Classic XXI",
    price: 1090000,
    brand: "Puma",
    color: "Đen/Trắng",
    desc: "Suede mềm, thiết kế tối giản và trẻ trung.",
  },
  {
    id: 14,
    name: "Converse Classic",
    price: 1500000,
    brand: "Converse",
    color: "Đỏ/Trắng",
    desc: "Mẫu canvas cổ điển, năng động.",
  },
  {
    id: 15,
    name: "Nike Air Max 270 React",
    price: 1890000,
    brand: "Nike",
    color: "Đỏ/Trắng",
    desc: "Đệm Air lớn, kiểu dáng thể thao nổi bật.",
  },
];
const money = (n) => Math.max(0, Math.round(n)).toLocaleString("vi-VN") + "đ";
const imgPath = (p) => "images/shoe-" + p.id + "-main.png";
const detailPath = (id, i) => "images/shoe-" + id + "-" + i + ".png";
function safeRead(k, def = []) {
  try {
    return JSON.parse(localStorage.getItem(k) || JSON.stringify(def));
  } catch (e) {
    return def;
  }
}
function save(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}
function normalizeCart() {
  let cart = safeRead("cart", null);
  if (!Array.isArray(cart)) {
    const bag = safeRead("bag", []);
    cart = [];
    bag.forEach((id) => {
      const p = PRODUCTS.find((x) => x.id == id);
      if (p) {
        const ex = cart.find((i) => i.id == p.id && String(i.size) === "42");
        ex
          ? ex.qty++
          : cart.push({ id: p.id, qty: 1, size: 42, color: p.color });
      }
    });
    localStorage.removeItem("bag");
  }
  cart = (cart || [])
    .filter((i) => PRODUCTS.some((p) => p.id == i.id))
    .map((i) => ({
      id: +i.id,
      qty: Math.max(1, +i.qty || 1),
      size: i.size || 42,
      color: i.color || "",
    }));
  save("cart", cart);
  return cart;
}
function getCart() {
  return normalizeCart();
}
function setCart(c) {
  save("cart", c);
  updateCounts();
}
function getWishlist() {
  return safeRead("wishlist", [])
    .map(Number)
    .filter((id) => PRODUCTS.some((p) => p.id == id));
}
function setWishlist(w) {
  save("wishlist", [...new Set(w.map(Number))]);
  updateCounts();
}
function cartQty() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}
function updateCounts() {
  document
    .querySelectorAll("[data-cart-count]")
    .forEach((e) => (e.textContent = cartQty()));
  document
    .querySelectorAll("[data-wishlist-count]")
    .forEach((e) => (e.textContent = getWishlist().length));
}
function addToCart(id, qty = 1, size = 42, color = "") {
  const p = PRODUCTS.find((x) => x.id == id);
  if (!p) return;
  let c = getCart();
  const key = c.find((i) => i.id == id && String(i.size) == String(size));
  if (key) key.qty += qty;
  else c.push({ id: +id, qty: +qty || 1, size, color: color || p.color });
  setCart(c);
  toast("Đã thêm vào giỏ hàng");
}
function removeFromCart(id, size) {
  setCart(
    getCart().filter((i) => !(i.id == id && String(i.size) == String(size))),
  );
}
function changeQty(id, size, delta) {
  let c = getCart();
  const it = c.find((i) => i.id == id && String(i.size) == String(size));
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) c = c.filter((x) => x !== it);
  setCart(c);
}
function clearCart() {
  setCart([]);
}
function toggleWishlist(id) {
  let w = getWishlist();
  w = w.includes(+id) ? w.filter((x) => x !== +id) : [...w, +id];
  setWishlist(w);
  toast(w.includes(+id) ? "Đã thêm vào wishlist" : "Đã xoá khỏi wishlist");
}
function toast(msg) {
  let t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1600);
}
function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}
function loginUser(name, email) {
  localStorage.setItem("loggedIn", "true");
  const current = getProfile();
  setProfile({
    ...current,
    name: name || current.name,
    email: email || current.email,
  });
}
function logout() {
  localStorage.removeItem("loggedIn");
  location.href = "login.html";
}
function header(active = "") {
  return `<header class="site-header"><div class="nav-shell"><nav class="nav-links"><a class="${active === "home" ? "active" : ""}" href="index.html">TRANG CHỦ</a><a class="${active === "products" ? "active" : ""}" href="allproduct.html">SẢN PHẨM</a><a class="${active === "orders" ? "active" : ""}" href="order_history.html">ĐƠN HÀNG</a><a class="${active === "profile" ? "active" : ""}" href="profile.html">HỒ SƠ</a><a class="${active === "login" ? "active" : ""}" href="login.html">ĐĂNG NHẬP</a></nav><a class="brand" href="index.html">Bin Store</a><div class="nav-icons"><a class="icon-btn" href="wishlist.html" title="Wishlist"><span class="icon-symbol">♡</span><span class="badge" data-wishlist-count>0</span></a><a class="icon-btn" href="cart.html" title="Giỏ hàng"><span class="icon-symbol">🛒</span><span class="badge" data-cart-count>0</span></a></div></div></header>`;
}
function footer() {
  return `<footer class="footer"><div class="container footer-grid"><div><h3>Bin Store</h3><p>Nơi mang đến những đôi giày chính hãng, chất lượng và phong cách nhất.</p><div class="socials"><span>f</span><span>◎</span><span>▶</span><span>♪</span></div></div><div><h4>VỀ CHÚNG TÔI</h4><a>Giới thiệu</a><br><a>Tin tức</a><br><a>Tuyển dụng</a><br><a>Liên hệ</a></div><div><h4>CHÍNH SÁCH</h4><a>Chính sách bảo mật</a><br><a>Chính sách đổi trả</a><br><a>Chính sách vận chuyển</a><br><a>Điều khoản sử dụng</a></div><div><h4>HỖ TRỢ</h4><a>Hướng dẫn mua hàng</a><br><a>Câu hỏi thường gặp</a><br><a>Thanh toán</a><br><a>Gửi khiếu nại</a></div><div><h4>ĐĂNG KÝ NHẬN TIN</h4><p>Nhận thông tin khuyến mãi và sản phẩm mới nhất</p><div class="newsletter"><input placeholder="Nhập email của bạn"><button>➤</button></div></div></div><div class="copyright">© 2026 Bin Store. All rights reserved.</div></footer>`;
}
function getProfile() {
  return Object.assign(
    {
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0123 456 789",
      birthday: "01/01/2000",
      gender: "Nam",
      address: "Hà Nội",
    },
    safeRead("profile", {}),
  );
}
function setProfile(profile) {
  save("profile", profile);
}
function accountMini() {
  const u = getProfile();
  return `<div class="user-mini"><div class="avatar-mini">👤</div><div><b data-profile-name>${u.name}</b><p class="muted" data-profile-email>${u.email}</p></div></div>`;
}
function trust() {
  return `<section class="trust"><div class="trust-item"><div class="trust-icon">🛡</div><div><b>100% Chính hãng</b><span>Cam kết sản phẩm chính hãng</span></div></div><div class="trust-item"><div class="trust-icon">🚚</div><div><b>Giao hàng nhanh</b><span>Giao hàng toàn quốc</span></div></div><div class="trust-item"><div class="trust-icon">📦</div><div><b>Đổi trả dễ dàng</b><span>Đổi trả trong 7 ngày</span></div></div><div class="trust-item"><div class="trust-icon">🎧</div><div><b>Hỗ trợ 24/7</b><span>Luôn sẵn sàng hỗ trợ bạn</span></div></div></section>`;
}
function orderTotal(cart, ship = 30000, discount = 950000) {
  const subtotal = cart.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id == i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  const d = qty ? Math.min(discount, subtotal) : 0;
  const shipping = qty ? ship : 0;
  return {
    subtotal,
    discount: d,
    shipping,
    total: Math.max(0, subtotal - d + shipping),
    qty,
  };
}
function getOrders() {
  return safeRead("orders", []);
}
function setOrders(o) {
  save("orders", o);
}
function hiddenOrders() {
  return safeRead("hiddenOrders", []);
}
function hideOrder(code) {
  save("hiddenOrders", [...new Set([...hiddenOrders(), code])]);
}
document.addEventListener("DOMContentLoaded", updateCounts);
