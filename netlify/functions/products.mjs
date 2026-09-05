import { getStore } from "@netlify/blobs";

const SEED = [
  {
    id: "001",
    name: "6000mAh Digital Mini Fan",
    price: "₱136–₱189",
    category: "Tech",
    emoji: "🌀",
    description: "Foldable and portable rechargeable mini fan.",
    link: "https://s.shopee.ph/8AVUijTW9u"
  },
  {
    id: "002",
    name: "Foldable Phone & Tablet Stand",
    price: "₱45",
    category: "Tech",
    emoji: "📱",
    description: "Adjustable stand for phones and tablets.",
    link: "https://s.shopee.ph/7KwNkPX7gr"
  },
  {
    id: "003",
    name: "Double Head LED Desk Lamp",
    price: "₱149–₱209",
    category: "Home",
    emoji: "💡",
    description: "Rechargeable desk lamp for studying and working.",
    link: "https://s.shopee.ph/6AkRxBoKHm"
  },
  {
    id: "004",
    name: "10-in-1 Travel Organizer",
    price: "₱195–₱429",
    category: "Travel",
    emoji: "🎒",
    description: "Keep clothes and travel essentials organized.",
    link: "https://s.shopee.ph/3qMYxFfVoC"
  },
  {
    id: "005",
    name: "BELINDA Large Capacity Tote Bag",
    price: "₱148–₱220",
    category: "Fashion",
    emoji: "👜",
    description: "Simple waterproof PU leather shoulder bag.",
    link: "https://s.shopee.ph/40g18wRO6c"
  },
  {
    id: "006",
    name: "Makeup & Book Organizer",
    price: "₱130–₱145",
    category: "Home",
    emoji: "🏠",
    description: "Table organizer for makeup, books and essentials.",
    link: "https://s.shopee.ph/AAGhJ5wzMH"
  },
  {
    id: "007",
    name: "Wireless Bluetooth Headphones",
    price: "₱253–₱423",
    category: "Tech",
    emoji: "🎧",
    description: "Portable Bluetooth headphones with deep bass.",
    link: "https://s.shopee.ph/8fRuilQE7D"
  },
  {
    id: "008",
    name: "Tumbler / Water Bottle",
    price: "Check latest price",
    category: "Lifestyle",
    emoji: "🥤",
    description: "Practical everyday tumbler for school, work and travel.",
    link: "https://s.shopee.ph/8fRvMcrkyH"
  },
  {
    id: "009",
    name: "Mini Electric Vegetable Chopper",
    price: "₱129–₱185",
    category: "Kitchen",
    emoji: "🍳",
    description: "Handy mini food processor for everyday cooking.",
    link: "https://s.shopee.ph/LmrY1WnkB"
  },
  {
    id: "010",
    name: "SYA Portable Wet & Dry Vacuum",
    price: "₱125",
    category: "Home",
    emoji: "🧹",
    description: "Portable cleaner for your car, desk, sofa and home.",
    link: "https://s.shopee.ph/8AVpzBPP8b"
  }
];

const reply = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store"
    }
  });

async function getProducts(store) {
  let products = await store.get("products", { type: "json" });

  if (!Array.isArray(products)) {
    products = SEED;
    await store.setJSON("products", products);
  }

  return products;
}

function isAuthorized(request) {
  const password = request.headers.get("x-admin-password") || "";

  return (
    Boolean(process.env.ADMIN_PASSWORD) &&
    password === process.env.ADMIN_PASSWORD
  );
}

export default async (request) => {
  try {
    const store = getStore("findora-products");
    const method = request.method.toUpperCase();

    if (method === "GET") {
      const products = await getProducts(store);
      return reply({ products });
    }

    if (!isAuthorized(request)) {
      return reply({ error: "Unauthorized" }, 401);
    }

    let products = await getProducts(store);

    if (method === "POST") {
      const body = await request.json();

      if (!body?.name) {
        return reply({ error: "Product name is required" }, 400);
      }

      const product = {
        id: String(body.id || Date.now()),
        name: String(body.name),
        price: String(body.price || ""),
        category: String(body.category || "Others"),
        emoji: String(body.emoji || "🛍️"),
        description: String(body.description || ""),
        link: String(body.link || "")
        image: String(body.image || "")
      };

      const index = products.findIndex(
        (item) => String(item.id) === String(product.id)
      );

      if (index >= 0) {
        products[index] = product;
      } else {
        products.push(product);
      }

      products.sort((a, b) =>
        String(a.id).localeCompare(String(b.id), undefined, {
          numeric: true
        })
      );

      await store.setJSON("products", products);

      return reply({
        success: true,
        products
      });
    }

    if (method === "DELETE") {
      const body = await request.json();

      products = products.filter(
        (item) => String(item.id) !== String(body.id)
      );

      await store.setJSON("products", products);

      return reply({
        success: true,
        products
      });
    }

    return reply({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error(error);

    return reply(
      {
        error: "Server error",
        message: error.message
      },
      500
    );
  }
};
