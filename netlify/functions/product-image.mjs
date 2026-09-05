import { getStore } from "@netlify/blobs";

export default async (request) => {
  try {
    const url = new URL(request.url);
    const fileName = url.searchParams.get("file");

    if (!fileName) {
      return new Response("Image not specified.", {
        status: 400
      });
    }

    // Basic protection against invalid filenames
    if (
      fileName.includes("/") ||
      fileName.includes("\\") ||
      fileName.includes("..")
    ) {
      return new Response("Invalid image.", {
        status: 400
      });
    }

    const store = getStore("findora-product-images");

    const image = await store.get(fileName, {
      type: "arrayBuffer"
    });

    if (!image) {
      return new Response("Image not found.", {
        status: 404
      });
    }

    const metadataResult =
      await store.getMetadata(fileName);

    const contentType =
      metadataResult?.metadata?.contentType ||
      "image/jpeg";

    return new Response(image, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control":
          "public, max-age=31536000, immutable"
      }
    });

  } catch (error) {
    console.error(error);

    return new Response("Unable to load image.", {
      status: 500
    });
  }
};
