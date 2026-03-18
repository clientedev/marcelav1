/// <reference types="node" />
import app from "./app";

// For local development or non-serverless environments
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const rawPort = process.env["PORT"];

  if (rawPort) {
    const port = Number(rawPort);
    if (!Number.isNaN(port) && port > 0) {
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    }
  } else {
    // Default port for local dev if not provided
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

export default app;
