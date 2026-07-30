export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed" });
  }

  const { guestName, email, hotelName, city, checkIn, checkOut, guests, nights, total } = request.body ?? {};
  if (!guestName || !email || !hotelName || !checkIn || !checkOut || checkOut <= checkIn) {
    return response.status(400).json({ message: "Invalid booking data" });
  }

  const reference = `IVX-${Date.now().toString(36).toUpperCase()}`;
  return response.status(201).json({
    reference,
    guestName: String(guestName).slice(0, 80),
    email: String(email).slice(0, 120),
    hotelName: String(hotelName).slice(0, 120),
    city: String(city).slice(0, 80),
    checkIn,
    checkOut,
    guests: Number(guests),
    nights: Number(nights),
    total: Number(total),
    demo: true
  });
}
