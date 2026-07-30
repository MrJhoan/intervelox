export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, subject, message } = request.body ?? {};
  if (!name || !email || !subject || !message) {
    return response.status(400).json({ message: "All fields are required" });
  }

  return response.status(201).json({
    received: true,
    demo: true,
    reference: `MSG-${Date.now().toString(36).toUpperCase()}`
  });
}
