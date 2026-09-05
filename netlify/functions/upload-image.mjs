import { getStore } from "@netlify/blobs";

const reply = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store"
    }
  });

function isAuthorized(request) {
  const password = request.headers.get("x-admin-password") || "";

  return (
    Boolean(process.env.ADMIN_PASSWORD) &&
    password === process.env.ADMIN_PASSWORD
  );
}

export default async (request) => {
  try {
    if (request.method.toUpperCase() !== "POST") {
      return reply({ error: "Method not allowed" }, 405);
    }

    if (!isAuthorized(request)) {
      return reply({ error: "Unauthorized" }, 401);
    }

    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.startsWith("image/")) {
      return reply(
        { error: "Please upload a valid image." },
        400
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(contentType)) {
      return reply(
        {
          error:
            "Only JPG, PNG, and WEBP images are allowed."
        },
        400
      );
    }

    const imageBuffer =
      await request.arrayBuffer();

    const maxSize = 5 * 1024 * 1024;

    if (imageBuffer.byteLength > maxSize) {
      return reply(
        {
          error:
            "Image must be 5MB or smaller."
        },
        400
      );
    }

    const extension =
      contentType === "image/png"
        ? "png"
        : contentType === "image/webp"
        ? "webp"
        : "jpg";

    const fileName =
      `product-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;

    const store =
      getStore("findora-product-images");

    await store.set(fileName, imageBuffer, {
      metadata: {
        contentType
      }
    });

    return reply({
      success: true,
      fileName,
      imageUrl:
        `/.netlify/functions/product-image?file=${encodeURIComponent(fileName)}`
    });
  } catch (error) {
    console.error(error);

    return reply(
      {
        error: "Upload failed",
        message: error.message
      },
      500
    );
  }
};
