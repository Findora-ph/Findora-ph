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
  let products = await store.get("products", {
    type: "json"
  });

  if (!Array.isArray(products)) {
    products = SEED;
    await store.setJSON("products", products);
  }

  return products;
}

export default async (request) => {
  try {
    const store = getStore("findora-products");
    const method = request.method.toUpperCase();

    if (method === "GET") {
      const products = await getProducts(store);
      return reply(products);
    }

    if (method !== "POST") {
      return reply({ error: "Method not allowed" }, 405);
    }

    const body = await request.json();

    if (
      !process.env.ADMIN_PASSWORD ||
      body.password !== process.env.ADMIN_PASSWORD
    ) {
      return reply({ error: "Unauthorized" }, 401);
    }

    const action = body.action;
    let products = await getProducts(store);

    if (action === "add") {
      if (!body.product?.name) {
        return reply({ error: "Product name is required" }, 400);
      }

      const product = {
        id: String(body.product.id || Date.now()),
        name: String(body.product.name),
        price: String(body.product.price || ""),
        category: String(body.product.category || "Others"),
        emoji: String(body.product.emoji || "🛍️"),
        description: String(body.product.description || ""),
        link: String(body.product.link || "")
      };

      products.push(product);
    } else if (action === "update") {
      const index = products.findIndex(
        (product) => String(product.id) === String(body.product?.id)
      );

      if (index === -1) {
        return reply({ error: "Product not found" }, 404);
      }

      products[index] = {
        ...products[index],
        ...body.product,
        id: products[index].id
      };
    } else if (action === "delete") {
      products = products.filter(
        (product) => String(product.id) !== String(body.id)
      );
    } else {
      return reply({ error: "Invalid action" }, 400);
    }

    await store.setJSON("products", products);

    return reply({
      success: true,
      products
    });
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
