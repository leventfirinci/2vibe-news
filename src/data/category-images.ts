/**
 * Category placeholder images — shown when RSS doesn't provide an image.
 * Uses Unsplash (free, hotlink-friendly, high quality).
 * Each category has 6 images. Article title hash picks which one.
 * Same article always gets the same image (deterministic).
 */

const CATEGORY_IMAGES: Record<string, string[]> = {
  economy: [
    "https://images.unsplash.com/photo-1611974789855-8d24af7b85c2?w=600&h=340&fit=crop&auto=format&q=80", // stock chart
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=340&fit=crop&auto=format&q=80", // coins stacked
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=340&fit=crop&auto=format&q=80", // dollar bills
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop&auto=format&q=80", // analytics dashboard
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=340&fit=crop&auto=format&q=80", // business suit
    "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&h=340&fit=crop&auto=format&q=80", // city skyline finance
  ],
  politics: [
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=340&fit=crop&auto=format&q=80", // parliament
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&h=340&fit=crop&auto=format&q=80", // government building
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=340&fit=crop&auto=format&q=80", // flags
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=340&fit=crop&auto=format&q=80", // voting
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&h=340&fit=crop&auto=format&q=80", // newspaper
    "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=600&h=340&fit=crop&auto=format&q=80", // debate
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=340&fit=crop&auto=format&q=80", // circuit board
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=340&fit=crop&auto=format&q=80", // cybersecurity
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=340&fit=crop&auto=format&q=80", // laptop code
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop&auto=format&q=80", // AI chip
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=340&fit=crop&auto=format&q=80", // tech abstract
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=340&fit=crop&auto=format&q=80", // team working
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-bd45ba1a845b?w=600&h=340&fit=crop&auto=format&q=80", // stadium
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=340&fit=crop&auto=format&q=80", // football
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=340&fit=crop&auto=format&q=80", // basketball
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=340&fit=crop&auto=format&q=80", // running
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=340&fit=crop&auto=format&q=80", // soccer field
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=340&fit=crop&auto=format&q=80", // swimming
  ],
  world: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format&q=80", // earth from space
    "https://images.unsplash.com/photo-1526470608268-f674ce90eece?w=600&h=340&fit=crop&auto=format&q=80", // world map
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=600&h=340&fit=crop&auto=format&q=80", // globe
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=340&fit=crop&auto=format&q=80", // landscape
    "https://images.unsplash.com/photo-1504711434969-e33886168d1c?w=600&h=340&fit=crop&auto=format&q=80", // city aerial
    "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=600&h=340&fit=crop&auto=format&q=80", // conflict zone
  ],
  science: [
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&h=340&fit=crop&auto=format&q=80", // laboratory
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=340&fit=crop&auto=format&q=80", // space rocket
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=340&fit=crop&auto=format&q=80", // microscope
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&h=340&fit=crop&auto=format&q=80", // DNA
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=340&fit=crop&auto=format&q=80", // nebula
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=340&fit=crop&auto=format&q=80", // chemistry
  ],
  health: [
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=340&fit=crop&auto=format&q=80", // hospital
    "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&h=340&fit=crop&auto=format&q=80", // stethoscope
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&h=340&fit=crop&auto=format&q=80", // medical
    "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=340&fit=crop&auto=format&q=80", // pills
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=340&fit=crop&auto=format&q=80", // health care
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=340&fit=crop&auto=format&q=80", // doctor
  ],
  culture: [
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=340&fit=crop&auto=format&q=80", // art
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=340&fit=crop&auto=format&q=80", // music
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=340&fit=crop&auto=format&q=80", // cinema
    "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=600&h=340&fit=crop&auto=format&q=80", // theater
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=340&fit=crop&auto=format&q=80", // painting
    "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=340&fit=crop&auto=format&q=80", // museum
  ],
  breaking: [
    "https://images.unsplash.com/photo-1504711434969-e33886168d1c?w=600&h=340&fit=crop&auto=format&q=80", // city
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&h=340&fit=crop&auto=format&q=80", // newspaper
    "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=600&h=340&fit=crop&auto=format&q=80", // scene
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop&auto=format&q=80", // earth
    "https://images.unsplash.com/photo-1526470608268-f674ce90eece?w=600&h=340&fit=crop&auto=format&q=80", // map
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=340&fit=crop&auto=format&q=80", // landscape
  ],
};

/**
 * Get a deterministic placeholder image for an article.
 * Same title always returns the same image.
 */
export function getCategoryImage(category: string, title: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.world;

  // Simple hash of title → deterministic index
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash + title.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % images.length;

  return images[index];
}
