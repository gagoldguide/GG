/**
 * Georgia coverage list.
 *
 * REFERENCE DATA, NOT A CLAIM. Appearing here means the city is inside the service area — it
 * does NOT mean a verified buyer operates there. A city page only goes live once `City.published`
 * is true in the database, which itself requires at least one licence-verified buyer.
 *
 * That gate is the defence against the doorway-page problem: ~50 near-identical "gold buyers in
 * {city}" pages with no real local data is a pattern Google demotes, and it can drag the whole
 * domain down with it. Fewer real pages beat fifty templated ones.
 *
 * Population is deliberately absent. Inventing figures to pad a page is exactly the kind of
 * plausible-but-unverified content this project does not ship.
 */

export type CitySeed = {
  slug: string
  name: string
  county: string
  /** Loose grouping used for the directory index, not an official designation. */
  region: 'Metro Atlanta' | 'North Georgia' | 'Middle Georgia' | 'Coastal' | 'South Georgia' | 'West Georgia'
}

export const GEORGIA_CITIES: CitySeed[] = [
  // ---- Metro Atlanta
  { slug: 'atlanta', name: 'Atlanta', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'sandy-springs', name: 'Sandy Springs', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'roswell', name: 'Roswell', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'alpharetta', name: 'Alpharetta', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'johns-creek', name: 'Johns Creek', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'milton', name: 'Milton', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'east-point', name: 'East Point', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'union-city', name: 'Union City', county: 'Fulton', region: 'Metro Atlanta' },
  { slug: 'marietta', name: 'Marietta', county: 'Cobb', region: 'Metro Atlanta' },
  { slug: 'smyrna', name: 'Smyrna', county: 'Cobb', region: 'Metro Atlanta' },
  { slug: 'kennesaw', name: 'Kennesaw', county: 'Cobb', region: 'Metro Atlanta' },
  { slug: 'acworth', name: 'Acworth', county: 'Cobb', region: 'Metro Atlanta' },
  { slug: 'powder-springs', name: 'Powder Springs', county: 'Cobb', region: 'Metro Atlanta' },
  { slug: 'decatur', name: 'Decatur', county: 'DeKalb', region: 'Metro Atlanta' },
  { slug: 'dunwoody', name: 'Dunwoody', county: 'DeKalb', region: 'Metro Atlanta' },
  { slug: 'brookhaven', name: 'Brookhaven', county: 'DeKalb', region: 'Metro Atlanta' },
  { slug: 'tucker', name: 'Tucker', county: 'DeKalb', region: 'Metro Atlanta' },
  { slug: 'lawrenceville', name: 'Lawrenceville', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'duluth', name: 'Duluth', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'norcross', name: 'Norcross', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'snellville', name: 'Snellville', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'suwanee', name: 'Suwanee', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'buford', name: 'Buford', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'sugar-hill', name: 'Sugar Hill', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'peachtree-corners', name: 'Peachtree Corners', county: 'Gwinnett', region: 'Metro Atlanta' },
  { slug: 'douglasville', name: 'Douglasville', county: 'Douglas', region: 'Metro Atlanta' },
  { slug: 'mcdonough', name: 'McDonough', county: 'Henry', region: 'Metro Atlanta' },
  { slug: 'stockbridge', name: 'Stockbridge', county: 'Henry', region: 'Metro Atlanta' },
  { slug: 'jonesboro', name: 'Jonesboro', county: 'Clayton', region: 'Metro Atlanta' },
  { slug: 'riverdale', name: 'Riverdale', county: 'Clayton', region: 'Metro Atlanta' },
  { slug: 'forest-park', name: 'Forest Park', county: 'Clayton', region: 'Metro Atlanta' },
  { slug: 'conyers', name: 'Conyers', county: 'Rockdale', region: 'Metro Atlanta' },
  { slug: 'fayetteville', name: 'Fayetteville', county: 'Fayette', region: 'Metro Atlanta' },
  { slug: 'peachtree-city', name: 'Peachtree City', county: 'Fayette', region: 'Metro Atlanta' },
  { slug: 'woodstock', name: 'Woodstock', county: 'Cherokee', region: 'Metro Atlanta' },
  { slug: 'canton', name: 'Canton', county: 'Cherokee', region: 'Metro Atlanta' },
  { slug: 'newnan', name: 'Newnan', county: 'Coweta', region: 'Metro Atlanta' },
  { slug: 'cartersville', name: 'Cartersville', county: 'Bartow', region: 'Metro Atlanta' },

  // ---- North Georgia
  { slug: 'athens', name: 'Athens', county: 'Clarke', region: 'North Georgia' },
  { slug: 'gainesville', name: 'Gainesville', county: 'Hall', region: 'North Georgia' },
  { slug: 'rome', name: 'Rome', county: 'Floyd', region: 'North Georgia' },
  { slug: 'dalton', name: 'Dalton', county: 'Whitfield', region: 'North Georgia' },

  // ---- West Georgia
  { slug: 'carrollton', name: 'Carrollton', county: 'Carroll', region: 'West Georgia' },
  { slug: 'lagrange', name: 'LaGrange', county: 'Troup', region: 'West Georgia' },
  { slug: 'columbus', name: 'Columbus', county: 'Muscogee', region: 'West Georgia' },

  // ---- Middle Georgia
  { slug: 'macon', name: 'Macon', county: 'Bibb', region: 'Middle Georgia' },
  { slug: 'warner-robins', name: 'Warner Robins', county: 'Houston', region: 'Middle Georgia' },
  { slug: 'perry', name: 'Perry', county: 'Houston', region: 'Middle Georgia' },
  { slug: 'griffin', name: 'Griffin', county: 'Spalding', region: 'Middle Georgia' },
  { slug: 'augusta', name: 'Augusta', county: 'Richmond', region: 'Middle Georgia' },

  // ---- Coastal
  { slug: 'savannah', name: 'Savannah', county: 'Chatham', region: 'Coastal' },
  { slug: 'pooler', name: 'Pooler', county: 'Chatham', region: 'Coastal' },
  { slug: 'hinesville', name: 'Hinesville', county: 'Liberty', region: 'Coastal' },
  { slug: 'brunswick', name: 'Brunswick', county: 'Glynn', region: 'Coastal' },

  // ---- South Georgia
  { slug: 'albany', name: 'Albany', county: 'Dougherty', region: 'South Georgia' },
  { slug: 'valdosta', name: 'Valdosta', county: 'Lowndes', region: 'South Georgia' },
  { slug: 'thomasville', name: 'Thomasville', county: 'Thomas', region: 'South Georgia' },
  { slug: 'statesboro', name: 'Statesboro', county: 'Bulloch', region: 'South Georgia' },
  { slug: 'americus', name: 'Americus', county: 'Sumter', region: 'South Georgia' },
]

export const REGIONS = [
  'Metro Atlanta',
  'North Georgia',
  'Middle Georgia',
  'West Georgia',
  'Coastal',
  'South Georgia',
] as const

export function findCity(slug: string): CitySeed | undefined {
  return GEORGIA_CITIES.find((c) => c.slug === slug)
}
