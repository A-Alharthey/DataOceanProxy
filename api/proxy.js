export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "*"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const path = req.query.path || "";
  const url = `http://92.205.234.30:7071/api/${path}`;

  try {
    // ✅ forward ALL headers from frontend (including Authorization, formid, etc.)
    const headers = { ...req.headers };

    // 🔥 remove problematic ones (Node/Vercel will choke on these)
    delete headers.host;
    delete headers.connection;
    delete headers["content-length"];

    const response = await fetch(url, {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const contentType = response.headers.get("content-type");

    const data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}