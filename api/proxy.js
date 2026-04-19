export default async function handler(req, res) {
  const path = req.query.path || "";
  console.log("test")
  const url = `http://92.205.234.30:7071/api/${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" && req.method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined,
    });

    const contentType = response.headers.get("content-type");

    const data = contentType && contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}