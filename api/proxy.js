export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "*"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { path, ...query } = req.query;

  const queryString = new URLSearchParams(query).toString();
  const url = `http://92.205.234.30:7071/api/${path}`;
  console.log(url)

  try {
    const headers = { ...req.headers };

    delete headers.host;
    delete headers.connection;
    delete headers["content-length"];
    delete headers["accept-encoding"];

    let body = undefined;

    if (req.method !== "GET" && req.method !== "HEAD") {
      body =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body);
    }

    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
    });

    const contentType = response.headers.get("content-type");

    const data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    res.status(response.status).send(data + url);
  } catch (error) {
    console.error(error); // 👈 IMPORTANT
    res.status(500).json({ error: "Proxy error", details: url });
  }
}