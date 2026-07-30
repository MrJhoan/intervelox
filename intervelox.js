const hotels = [
  {
    id: "chicamocha",
    name: "Hotel Chicamocha",
    city: "Bucaramanga",
    coordinates: [7.1193, -73.1227],
    price: 199000,
    flashPrice: 139000,
    rating: 4.6,
    amenities: "Piscina · Desayuno · Wi-Fi",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=82"
  },
  {
    id: "ciudad-bonita",
    name: "Hotel Ciudad Bonita",
    city: "Bucaramanga",
    coordinates: [7.1254, -73.1198],
    price: 180000,
    flashPrice: 126000,
    rating: 4.4,
    amenities: "Gimnasio · Restaurante · Wi-Fi",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=82"
  },
  {
    id: "dann-carlton",
    name: "Dann Carlton",
    city: "Bucaramanga",
    coordinates: [7.1167, -73.1103],
    price: 320000,
    rating: 4.8,
    amenities: "Spa · Piscina · Desayuno",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=82"
  },
  {
    id: "sofitel-santa-clara",
    name: "Sofitel Legend Santa Clara",
    city: "Cartagena",
    coordinates: [10.4296, -75.5450],
    price: 890000,
    flashPrice: 649000,
    rating: 4.9,
    amenities: "Centro histórico · Spa · Piscina",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=82"
  },
  {
    id: "casa-medina",
    name: "Casa Medina",
    city: "Bogotá",
    coordinates: [4.6533, -74.0555],
    price: 620000,
    rating: 4.8,
    amenities: "Arquitectura histórica · Spa · Bar",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=82"
  },
  {
    id: "medellin-royal",
    name: "The Charlee",
    city: "Medellín",
    coordinates: [6.2088, -75.5664],
    price: 470000,
    rating: 4.7,
    amenities: "Rooftop · Piscina · Zona Rosa",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=82"
  }
];

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const hotelGrid = document.querySelector("#hotel-grid");
const flashGrid = document.querySelector("#flash-grid");
const bookingDialog = document.querySelector("#booking-dialog");
const bookingsDialog = document.querySelector("#bookings-dialog");
const bookingContent = document.querySelector("#booking-content");
let map;
let markers = [];
let activeSearch = null;

function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function cardTemplate(hotel, flash = false) {
  const activePrice = flash && hotel.flashPrice ? hotel.flashPrice : hotel.price;
  const discount = hotel.flashPrice ? Math.round((1 - hotel.flashPrice / hotel.price) * 100) : 0;
  return `
    <article class="hotel-card">
      ${flash ? `<span class="discount-badge">-${discount}% por tiempo limitado</span>` : ""}
      <img class="hotel-image" src="${hotel.image}" alt="Vista de ${safeText(hotel.name)}" loading="lazy">
      <div class="hotel-content">
        <div class="hotel-topline">
          <span class="hotel-city">${safeText(hotel.city)}</span>
          <span class="rating">★ ${hotel.rating}</span>
        </div>
        <h3>${safeText(hotel.name)}</h3>
        <p class="amenities">${safeText(hotel.amenities)}</p>
        <div class="price-row">
          <div class="price">
            ${flash ? `<span class="old-price">${currency.format(hotel.price)}</span>` : ""}
            <strong>${currency.format(activePrice)}</strong>
            <small>por noche</small>
          </div>
          <button class="button button-primary reserve-button" data-hotel="${hotel.id}" data-flash="${flash}">Reservar</button>
        </div>
      </div>
    </article>`;
}

function renderHotels(list = hotels) {
  hotelGrid.innerHTML = list.length ? list.map(hotel => cardTemplate(hotel)).join("") : `<div class="empty-state">No encontramos hoteles con esos criterios. Prueba otro destino.</div>`;
  document.querySelector("#results-copy").textContent = `${list.length} ${list.length === 1 ? "hotel disponible" : "hoteles disponibles"} para tu búsqueda.`;
}

function renderFlashDeals() {
  flashGrid.innerHTML = hotels.filter(hotel => hotel.flashPrice).map(hotel => cardTemplate(hotel, true)).join("");
}

function setDefaultDates() {
  const today = new Date();
  const arrival = new Date(today);
  arrival.setDate(today.getDate() + 1);
  const departure = new Date(today);
  departure.setDate(today.getDate() + 3);
  const iso = date => date.toISOString().split("T")[0];
  const checkIn = document.querySelector("#check-in");
  const checkOut = document.querySelector("#check-out");
  checkIn.min = iso(today);
  checkIn.value = iso(arrival);
  checkOut.min = iso(arrival);
  checkOut.value = iso(departure);
  checkIn.addEventListener("change", () => {
    checkOut.min = checkIn.value;
    if (checkOut.value <= checkIn.value) {
      const next = new Date(`${checkIn.value}T00:00:00`);
      next.setDate(next.getDate() + 1);
      checkOut.value = iso(next);
    }
  });
}

function nightsBetween(start, end) {
  return Math.max(1, Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000));
}

document.querySelector("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const destination = form.get("destination");
  const checkIn = form.get("checkIn");
  const checkOut = form.get("checkOut");
  const message = document.querySelector("#search-message");
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    message.textContent = "La fecha de salida debe ser posterior a la fecha de llegada.";
    return;
  }
  message.textContent = "";
  activeSearch = Object.fromEntries(form.entries());
  const results = destination === "all" ? hotels : hotels.filter(hotel => hotel.city === destination);
  renderHotels(results);
  document.querySelector("#hoteles").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("click", event => {
  const reserveButton = event.target.closest(".reserve-button");
  if (reserveButton) {
    const hotel = hotels.find(item => item.id === reserveButton.dataset.hotel);
    openBooking(hotel, reserveButton.dataset.flash === "true");
  }
});

function openBooking(hotel, flash) {
  const dates = activeSearch || {
    checkIn: document.querySelector("#check-in").value,
    checkOut: document.querySelector("#check-out").value,
    guests: document.querySelector("#guests").value
  };
  const price = flash && hotel.flashPrice ? hotel.flashPrice : hotel.price;
  bookingContent.innerHTML = `
    <div class="booking-head">
      <img src="${hotel.image}" alt="">
      <div><p class="eyebrow">${safeText(hotel.city)}</p><h2>${safeText(hotel.name)}</h2><p>★ ${hotel.rating} · ${safeText(hotel.amenities)}</p></div>
    </div>
    <form class="booking-form" id="booking-form">
      <input type="hidden" name="hotelId" value="${hotel.id}">
      <input type="hidden" name="flash" value="${flash}">
      <label>Nombre completo<input name="guestName" autocomplete="name" required maxlength="80"></label>
      <label>Correo electrónico<input name="email" type="email" autocomplete="email" required maxlength="120"></label>
      <label>Llegada<input name="checkIn" type="date" value="${dates.checkIn}" required></label>
      <label>Salida<input name="checkOut" type="date" value="${dates.checkOut}" required></label>
      <label>Huéspedes<select name="guests">${[1,2,3,4].map(n => `<option value="${n}" ${String(n) === String(dates.guests) ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <div class="booking-summary" id="booking-summary"></div>
      <button class="button button-primary" type="submit">Confirmar reserva demostrativa</button>
      <p class="form-message" id="booking-message" aria-live="polite"></p>
    </form>`;
  const form = document.querySelector("#booking-form");
  const update = () => updateBookingSummary(form, price);
  form.checkIn.addEventListener("change", update);
  form.checkOut.addEventListener("change", update);
  form.addEventListener("submit", submitBooking);
  update();
  bookingDialog.showModal();
  document.body.classList.add("modal-open");
}

function updateBookingSummary(form, price) {
  const valid = form.checkIn.value && form.checkOut.value && form.checkOut.value > form.checkIn.value;
  const nights = valid ? nightsBetween(form.checkIn.value, form.checkOut.value) : 0;
  document.querySelector("#booking-summary").innerHTML = `<div><span>${nights} ${nights === 1 ? "noche" : "noches"}</span><strong>${currency.format(price * nights)}</strong></div><small>No se realizará ningún cobro.</small>`;
}

async function submitBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const hotel = hotels.find(item => item.id === data.hotelId);
  const price = data.flash === "true" && hotel.flashPrice ? hotel.flashPrice : hotel.price;
  const message = document.querySelector("#booking-message");
  if (data.checkOut <= data.checkIn) {
    message.textContent = "La salida debe ser posterior a la llegada.";
    return;
  }
  const booking = {
    ...data,
    hotelName: hotel.name,
    city: hotel.city,
    nights: nightsBetween(data.checkIn, data.checkOut),
    total: price * nightsBetween(data.checkIn, data.checkOut)
  };
  try {
    const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(booking) });
    if (!response.ok) throw new Error("request failed");
    const saved = await response.json();
    const bookings = JSON.parse(localStorage.getItem("interveloxBookings") || "[]");
    bookings.unshift(saved);
    localStorage.setItem("interveloxBookings", JSON.stringify(bookings.slice(0, 10)));
    bookingDialog.close();
    document.body.classList.remove("modal-open");
    showToast(`Reserva demostrativa ${saved.reference} creada.`);
  } catch {
    message.textContent = "No fue posible registrar la reserva. Intenta nuevamente.";
  }
}

function renderBookings() {
  const bookings = JSON.parse(localStorage.getItem("interveloxBookings") || "[]");
  document.querySelector("#bookings-list").innerHTML = bookings.length
    ? bookings.map(item => `<div class="booking-item"><strong>${safeText(item.hotelName)}</strong><span>${safeText(item.checkIn)} → ${safeText(item.checkOut)} · ${currency.format(item.total)} · ${safeText(item.reference)}</span></div>`).join("")
    : `<div class="empty-state">Aún no tienes reservas demostrativas en este dispositivo.</div>`;
}

document.querySelector("#open-bookings").addEventListener("click", () => {
  renderBookings();
  bookingsDialog.showModal();
  document.body.classList.add("modal-open");
});
document.querySelectorAll(".dialog-close").forEach(button => button.addEventListener("click", () => {
  button.closest("dialog").close();
  document.body.classList.remove("modal-open");
}));
document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
  if (event.target === dialog) {
    dialog.close();
    document.body.classList.remove("modal-open");
  }
}));

document.querySelector("#contact-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector("#contact-message");
  try {
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
    if (!response.ok) throw new Error("request failed");
    form.reset();
    message.style.color = "var(--green)";
    message.textContent = "Mensaje demostrativo recibido. Gracias por probar Intervelox.";
  } catch {
    message.style.color = "var(--danger)";
    message.textContent = "No fue posible procesar el mensaje.";
  }
});

function initCountdown() {
  const key = "interveloxFlashDeadline";
  let deadline = Number(localStorage.getItem(key));
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + 2 * 60 * 60 * 1000;
    localStorage.setItem(key, String(deadline));
  }
  const tick = () => {
    const remaining = Math.max(0, deadline - Date.now());
    document.querySelector("#hours").textContent = String(Math.floor(remaining / 3600000)).padStart(2, "0");
    document.querySelector("#minutes").textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
    document.querySelector("#seconds").textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
    if (!remaining) {
      localStorage.removeItem(key);
      initCountdown();
    }
  };
  tick();
  setInterval(tick, 1000);
}

function initMap() {
  if (!window.L) return;
  map = L.map("hotel-map", { scrollWheelZoom: true }).setView([5.4, -74.5], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
  markers = hotels.map(hotel => L.marker(hotel.coordinates).addTo(map).bindPopup(`<strong>${safeText(hotel.name)}</strong><br>${safeText(hotel.city)}<br>Desde ${currency.format(hotel.price)}`));
  const cities = [...new Set(hotels.map(hotel => hotel.city))];
  document.querySelector("#destination-chips").innerHTML = cities.map(city => `<button type="button" data-city="${city}">${city}</button>`).join("");
  document.querySelector("#destination-chips").addEventListener("click", event => {
    const button = event.target.closest("[data-city]");
    if (!button) return;
    const hotel = hotels.find(item => item.city === button.dataset.city);
    map.flyTo(hotel.coordinates, 12);
    const marker = markers[hotels.indexOf(hotel)];
    marker.openPopup();
  });
  window.addEventListener("resize", () => map.invalidateSize());
}

function showToast(text) {
  const toast = document.querySelector("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

const menuButton = document.querySelector(".menu-button");
menuButton.addEventListener("click", () => {
  const links = document.querySelector("#nav-links");
  const open = links.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
  document.querySelector("#nav-links").classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

setDefaultDates();
renderFlashDeals();
renderHotels();
initCountdown();
initMap();
