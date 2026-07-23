// Shared data source for every generated page. Single source of truth for
// category copy, colours, photography, and product catalogue.

// Royalty-free photography (Unsplash License — free for commercial use).
// Helper builds a sized/quality-tuned CDN url from a bare photo id.
function img(id, w, q) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 1200}&q=${q || 75}`;
}

const CATEGORY_ICONS = {
  Lollipops: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="17" r="11"/><path d="M24 28 L24 44"/><path d="M24 17 m-4.5 0 a4.5 4.5 0 1 1 9 0 a4.5 4.5 0 1 1 -9 0"/></svg>',
  Biscuits: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="16"/><circle cx="18" cy="18" r="1.6" fill="currentColor" stroke="none"/><circle cx="31" cy="19" r="1.6" fill="currentColor" stroke="none"/><circle cx="24" cy="25" r="1.6" fill="currentColor" stroke="none"/><circle cx="17" cy="30" r="1.6" fill="currentColor" stroke="none"/><circle cx="30" cy="30" r="1.6" fill="currentColor" stroke="none"/></svg>',
  Chocolates: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="14" width="32" height="20" rx="2"/><line x1="24" y1="14" x2="24" y2="34"/><line x1="8" y1="24" x2="40" y2="24"/><line x1="16" y1="14" x2="16" y2="24"/><line x1="32" y1="24" x2="32" y2="34"/></svg>',
  Gummies: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="17" cy="14" r="4"/><circle cx="31" cy="14" r="4"/><path d="M14 20 a10 12 0 1 0 20 0 a10 12 0 1 0 -20 0"/></svg>',
  Wafers: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="10" y="9" width="28" height="6"/><rect x="10" y="18" width="28" height="6"/><rect x="10" y="27" width="28" height="6"/><rect x="10" y="36" width="28" height="4"/></svg>',
  Toffees: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="14" y="18" width="20" height="12" rx="2"/><path d="M14 20 L6 16 M14 28 L6 32"/><path d="M34 20 L42 16 M34 28 L42 32"/></svg>',
  'Jelly Beans': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M24 8 C32 8 38 16 38 26 C38 36 32 40 24 40 C16 40 10 36 10 26 C10 16 16 8 24 8 Z"/><circle cx="20" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="29" cy="24" r="1.4" fill="currentColor" stroke="none"/><circle cx="21" cy="31" r="1.4" fill="currentColor" stroke="none"/></svg>',
  Marshmallows: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="10" y="11" width="28" height="11" rx="5.5"/><rect x="10" y="26" width="28" height="11" rx="5.5"/></svg>',
  Candy: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="10"/><path d="M14 24 L6 18 M14 24 L6 30"/><path d="M34 24 L42 18 M34 24 L42 30"/></svg>'
};

// Pastel card-top colours reused on product card thumbnails (muted, per category)
const PASTELS = {
  Lollipops: '#FBE4EC',
  Biscuits: '#F2E6D9',
  Chocolates: '#E7DCD2',
  Gummies: '#E3F1E6',
  Wafers: '#FBEFE0',
  Toffees: '#F1E3D3',
  'Jelly Beans': '#E2F1EF',
  Marshmallows: '#FDEEF0',
  Candy: '#EFE3F1'
};

// Low-opacity decorative background shapes for the homepage slider, one per category.
// Each returns an 800x800 viewBox SVG string; rendered inside a wrapper at opacity:.08.
const BG_SHAPES = {
  lollipops: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" stroke-width="2"><circle cx="600" cy="180" r="140"/><circle cx="680" cy="420" r="90"/><circle cx="520" cy="560" r="60"/><circle cx="720" cy="650" r="40"/><circle cx="420" cy="300" r="30"/></svg>',
  biscuits: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" stroke-width="3"><path d="M0,200 C150,150 250,250 400,200 C550,150 650,250 800,200"/><path d="M0,350 C150,300 250,400 400,350 C550,300 650,400 800,350"/><path d="M0,500 C150,450 250,550 400,500 C550,450 650,550 800,500"/><path d="M0,650 C150,600 250,700 400,650 C550,600 650,700 800,650"/></svg>',
  chocolates: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="#fff"><rect x="85" y="85" width="70" height="70" transform="rotate(45 120 120)"/><rect x="285" y="85" width="70" height="70" transform="rotate(45 320 120)"/><rect x="485" y="85" width="70" height="70" transform="rotate(45 520 120)"/><rect x="685" y="85" width="70" height="70" transform="rotate(45 720 120)"/><rect x="85" y="325" width="70" height="70" transform="rotate(45 120 360)"/><rect x="285" y="325" width="70" height="70" transform="rotate(45 320 360)"/><rect x="485" y="325" width="70" height="70" transform="rotate(45 520 360)"/><rect x="685" y="325" width="70" height="70" transform="rotate(45 720 360)"/><rect x="85" y="565" width="70" height="70" transform="rotate(45 120 600)"/><rect x="285" y="565" width="70" height="70" transform="rotate(45 320 600)"/><rect x="485" y="565" width="70" height="70" transform="rotate(45 520 600)"/><rect x="685" y="565" width="70" height="70" transform="rotate(45 720 600)"/></svg>',
  gummies: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="#fff"><circle cx="60" cy="60" r="5"/><circle cx="190" cy="60" r="5"/><circle cx="320" cy="60" r="5"/><circle cx="450" cy="60" r="5"/><circle cx="580" cy="60" r="5"/><circle cx="710" cy="60" r="5"/><circle cx="60" cy="190" r="5"/><circle cx="190" cy="190" r="5"/><circle cx="320" cy="190" r="5"/><circle cx="450" cy="190" r="5"/><circle cx="580" cy="190" r="5"/><circle cx="710" cy="190" r="5"/><circle cx="60" cy="320" r="5"/><circle cx="190" cy="320" r="5"/><circle cx="320" cy="320" r="5"/><circle cx="450" cy="320" r="5"/><circle cx="580" cy="320" r="5"/><circle cx="710" cy="320" r="5"/><circle cx="60" cy="450" r="5"/><circle cx="190" cy="450" r="5"/><circle cx="320" cy="450" r="5"/><circle cx="450" cy="450" r="5"/><circle cx="580" cy="450" r="5"/><circle cx="710" cy="450" r="5"/><circle cx="60" cy="580" r="5"/><circle cx="190" cy="580" r="5"/><circle cx="320" cy="580" r="5"/><circle cx="450" cy="580" r="5"/><circle cx="580" cy="580" r="5"/><circle cx="710" cy="580" r="5"/><circle cx="60" cy="710" r="5"/><circle cx="190" cy="710" r="5"/><circle cx="320" cy="710" r="5"/><circle cx="450" cy="710" r="5"/><circle cx="580" cy="710" r="5"/><circle cx="710" cy="710" r="5"/></svg>',
  wafers: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="#fff"><rect x="0" y="150" width="800" height="22"/><rect x="0" y="290" width="800" height="22"/><rect x="0" y="430" width="800" height="22"/><rect x="0" y="570" width="800" height="22"/></svg>',
  toffees: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" stroke-width="2"><circle cx="550" cy="400" r="60"/><circle cx="550" cy="400" r="130"/><circle cx="550" cy="400" r="200"/><circle cx="550" cy="400" r="270"/><circle cx="550" cy="400" r="340"/></svg>',
  'jelly-beans': '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="#fff"><ellipse cx="120" cy="140" rx="22" ry="30"/><ellipse cx="260" cy="90" rx="14" ry="20"/><ellipse cx="400" cy="180" rx="26" ry="34"/><ellipse cx="560" cy="120" rx="16" ry="22"/><ellipse cx="680" cy="220" rx="20" ry="28"/><ellipse cx="200" cy="320" rx="18" ry="24"/><ellipse cx="480" cy="340" rx="24" ry="32"/><ellipse cx="650" cy="420" rx="14" ry="20"/><ellipse cx="320" cy="460" rx="20" ry="28"/><ellipse cx="120" cy="520" rx="16" ry="22"/><ellipse cx="580" cy="560" rx="22" ry="30"/><ellipse cx="420" cy="620" rx="18" ry="24"/><ellipse cx="240" cy="650" rx="24" ry="32"/><ellipse cx="700" cy="650" rx="16" ry="22"/></svg>',
  marshmallows: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="M250,400 C250,280 350,200 480,210 C610,220 680,320 660,440 C640,560 520,620 400,600 C280,580 250,520 250,400 Z"/></svg>',
  candy: '<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" stroke="#fff" stroke-width="4"><line x1="460" y1="400" x2="780" y2="400"/><line x1="452" y1="430" x2="729" y2="590"/><line x1="430" y1="452" x2="590" y2="729"/><line x1="400" y1="460" x2="400" y2="780"/><line x1="370" y1="452" x2="210" y2="729"/><line x1="348" y1="430" x2="71" y2="590"/><line x1="340" y1="400" x2="20" y2="400"/><line x1="348" y1="370" x2="71" y2="210"/><line x1="370" y1="348" x2="210" y2="71"/><line x1="400" y1="340" x2="400" y2="20"/><line x1="430" y1="348" x2="590" y2="71"/><line x1="452" y1="370" x2="729" y2="210"/></svg>'
};

const CATEGORIES = [
  {
    slug: 'lollipops', name: 'Lollipops', bg: '#1B3A2D', size: 'large', number: '01',
    image: img('1598188080888-42dfffa02287'),
    headline: ['Colour, Flavour,', 'Pure Joy'],
    descriptor: 'Our lollipop range spans classics to UAE-exclusive flavours — bulk supply for retail and gifting.',
    gridDescriptor: 'Classics and UAE-exclusive flavours in one wholesale range.',
    products: [
      { name: 'Classic Strawberry Lollipop', desc: 'Vibrant strawberry burst, iconic stick format.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'Rainbow Swirl Lollipop', desc: 'Five fruity flavours in one spiral.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'Watermelon Mega Pop', desc: 'Oversized watermelon format for display appeal.', tags: ['Halal', 'Bulk Available', 'Display Ready'] },
      { name: 'Sour Apple Lollipop', desc: 'Intense sour coating, sweet candy core.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Cola Fizz Lollipop', desc: 'Cola flavour with sherbet fizz inside.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Mango Chilli Pop', desc: 'UAE-exclusive mango with chilli coating.', tags: ['Halal', 'Bulk Available', 'UAE Exclusive'] }
    ]
  },
  {
    slug: 'biscuits', name: 'Biscuits', bg: '#2C1A0E', size: 'medium', number: '02',
    image: img('1622405207562-735fa49ff7f7'),
    headline: ['Baked to', 'Perfection'],
    descriptor: 'From butter crunch classics to tahini-infused UAE originals — wholesale biscuits your shelves will thank you for.',
    gridDescriptor: 'Butter crunch classics to tahini-infused UAE originals.',
    products: [
      { name: 'Butter Crunch Biscuits', desc: 'Golden baked, rich butter flavour.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Chocolate Chip Cookies', desc: 'Belgian chocolate chips, soft-baked.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Marie Gold Biscuits', desc: 'Light, crispy, classic tea companion.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Cream Sandwich Biscuits', desc: 'Vanilla cream between two cocoa rounds.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'Digestive Oat Biscuits', desc: 'Wholesome oat with honey sweetness.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Sesame Tahini Biscuits', desc: 'UAE-inspired, real sesame tahini paste.', tags: ['Halal', 'Bulk Available', 'UAE Exclusive'] }
    ]
  },
  {
    slug: 'chocolates', name: 'Chocolates', bg: '#1A0A00', size: 'small', number: '03',
    image: img('1606312619070-d48b4c652a52'),
    headline: ['Rich. Dark.', 'Unforgettable.'],
    descriptor: 'Belgian-sourced chocolate lines, dates & almond specialities, and white bark — premium wholesale options.',
    gridDescriptor: 'Belgian-sourced lines, dates & almond specialities, white bark.',
    products: [
      { name: 'Hazelnut Milk Chocolate', desc: 'Smooth Belgian milk, whole hazelnuts.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'Dark Mint Chocolate', desc: '72% cacao, peppermint cream filling.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'White Raspberry Bark', desc: 'White chocolate with freeze-dried raspberry.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'Dates & Almond Chocolate', desc: 'Premium dates in dark chocolate, almond crunch.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] }
    ]
  },
  {
    slug: 'gummies', name: 'Gummies', bg: '#1A2C1A', size: 'small', number: '04',
    headline: ['Soft, Chewy,', 'Full of Character'],
    descriptor: 'Bears, rings, worms, and hearts — a gummy range that moves fast off shelves.',
    gridDescriptor: 'Bears, rings, worms, and hearts that move fast off shelves.',
    products: [
      { name: 'Strawberry Gummy Bears', desc: 'Soft, chewy, real strawberry flavour.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Tropical Gummy Rings', desc: 'Mango, pineapple, passionfruit rings.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Sour Worm Gummies', desc: 'Tangy with sugar coating.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Peach Heart Gummies', desc: 'Peach-flavoured hearts, aromatic.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] }
    ]
  },
  {
    slug: 'wafers', name: 'Wafers', bg: '#1E1E2E', size: 'medium', number: '05',
    headline: ['Crisp Layers,', 'Creamy Heart'],
    descriptor: 'Light, satisfying wafer lines in vanilla, chocolate hazelnut, and strawberry — proven crowd-pleasers.',
    gridDescriptor: 'Vanilla, chocolate hazelnut, and strawberry crowd-pleasers.',
    products: [
      { name: 'Vanilla Cream Wafer', desc: 'Crispy layers, smooth vanilla cream.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Chocolate Hazelnut Wafer', desc: 'Rich hazelnut chocolate between wafer.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Strawberry Wafer Roll', desc: 'Rolled tubes, creamy strawberry filling.', tags: ['Halal', 'Bulk Available'] }
    ]
  },
  {
    slug: 'toffees', name: 'Toffees', bg: '#2A1500', size: 'large', number: '06',
    headline: ['Slow-Pull Butter,', 'Sea Salt Caramel'],
    descriptor: 'Classic and salted caramel toffees individually wrapped for gifting, retail, and impulse displays.',
    gridDescriptor: 'Individually wrapped for gifting, retail, and impulse displays.',
    products: [
      { name: 'Classic Butter Toffee', desc: 'Smooth, buttery, individually wrapped.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'Salted Caramel Toffee', desc: 'Sea salt caramel, addictive finish.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] }
    ]
  },
  {
    slug: 'jelly-beans', name: 'Jelly Beans', bg: '#0D1F2D', size: 'small', number: '07',
    headline: ['50 Flavours.', 'Endless Appeal.'],
    descriptor: 'The most colourful section of any confectionery aisle — stocked in gift jars and bulk bags.',
    gridDescriptor: 'The most colourful aisle section — gift jars and bulk bags.',
    products: [
      { name: 'Classic 50-Flavour Jelly Beans', desc: 'Gift jars and bulk bags.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] },
      { name: 'Tropical Jelly Bean Mix', desc: 'Lychee, mango, dragon fruit, guava.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] }
    ]
  },
  {
    slug: 'marshmallows', name: 'Marshmallows', bg: '#1A1A2E', size: 'large', number: '08',
    headline: ['Cloud-Soft.', 'Melt-In-Mouth.'],
    descriptor: 'Vanilla and strawberry twist marshmallows — a gifting staple and hot-drink companion.',
    gridDescriptor: 'A gifting staple and hot-drink companion.',
    products: [
      { name: 'Vanilla Cloud Marshmallows', desc: 'Fluffy vanilla, hot drink companion.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Strawberry Twist Marshmallows', desc: 'Pink/white twisted, gift-friendly.', tags: ['Halal', 'Bulk Available', 'Gift Ready'] }
    ]
  },
  {
    slug: 'candy', name: 'Candy', bg: '#1F1A00', size: 'small', number: '09',
    headline: ['Bold Flavours,', 'Timeless Formats'],
    descriptor: 'Fruit mixes, rose & cardamom, mint drops — our candy range celebrates regional taste.',
    gridDescriptor: 'Fruit mixes, rose & cardamom, and mint drops with regional taste.',
    products: [
      { name: 'Fruit Candy Mix', desc: 'Six fruity flavours, resealable bag.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Mint Drops', desc: 'Classic cooling mint, freshens instantly.', tags: ['Halal', 'Bulk Available'] },
      { name: 'Rose & Cardamom Candy', desc: 'UAE-inspired floral, rose water + cardamom.', tags: ['Halal', 'Bulk Available', 'UAE Exclusive'] },
      { name: 'Barley Sugar Twists', desc: 'Old-fashioned golden barley sugar.', tags: ['Halal', 'Bulk Available'] }
    ]
  }
];

module.exports = { CATEGORIES, CATEGORY_ICONS, PASTELS, BG_SHAPES };
