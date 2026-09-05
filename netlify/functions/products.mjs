import { getStore } from "@netlify/blobs";

const SEED = [
  {id:"001",name:"6000mAh Digital Mini Fan",price:"₱136–₱189",category:"Tech",emoji:"🌀",description:"Foldable and portable for school, work, commute, or your desk.",link:"https://s.shopee.ph/8AVUijTW9u",image:""},
  {id:"002",name:"Foldable Phone & Tablet Stand",price:"₱45",category:"Tech",emoji:"📱",description:"Adjustable stand for studying, streaming, and keeping your setup organized.",link:"https://s.shopee.ph/7KwNkPX7gr",image:""},
  {id:"003",name:"Double Head LED Desk Lamp",price:"₱149–₱209",category:"Home",emoji:"💡",description:"Rechargeable desk light for studying, reading, and late-night work.",link:"https://s.shopee.ph/6AkRxBoKHm",image:""},
  {id:"004",name:"10-in-1 Travel Organizer",price:"₱195–₱429",category:"Travel",emoji:"🎒",description:"Keep clothes, toiletries, and travel essentials neatly separated.",link:"https://s.shopee.ph/3qMYxFfVoC",image:""},
  {id:"005",name:"BELINDA Large Capacity Tote Bag",price:"₱148–₱220",category:"Fashion",emoji:"👜",description:"Simple, roomy PU leather tote for school, work, errands, and daily use.",link:"https://s.shopee.ph/40g18wRO6c",image:""},
  {id:"006",name:"Makeup & Book Organizer",price:"₱130–₱145",category:"Home",emoji:"🏠",description:"Space-saving storage for books, makeup, and everyday desk essentials.",link:"https://s.shopee.ph/AAGhJ5wzMH",image:""},
  {id:"007",name:"C2235 Wireless Bluetooth Headphones",price:"₱253–₱423",category:"Tech",emoji:"🎧",description:"Wireless listening with deep bass and comfortable earmuffs.",link:"https://s.shopee.ph/8fRuilQE7D",image:""},
  {id:"008",name:"Tumbler / Water Bottle",price:"Check latest price on Shopee",category:"Lifestyle",emoji:"🥤",description:"Practical everyday tumbler for school, work, travel, and daily hydration.",link:"https://s.shopee.ph/8fRvMcrkyH",image:""},
  {id:"009",name:"Mini Electric Vegetable Chopper",price:"₱129–₱185",category:"Kitchen",emoji:"🍳",description:"Handy for garlic, vegetables, meat, and quick everyday food preparation.",link:"https://s.shopee.ph/LmrY1WnkB",image:""},
  {id:"010",name:"SYA Portable Wet & Dry Vacuum",price:"₱125",category:"Home",emoji:"🧹",description:"Portable cleaner for quick cleanups around the car, desk, sofa, and small spaces.",link:"https://s.shopee.ph/8AVpzBPP8b",image:""}
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
  let products =
