export interface CityLocation {
  name: string;
  state?: string;
  zip?: string;
}

export interface CountryLocationInfo {
  states: string[];
  cities: CityLocation[];
  defaultZipPrefix?: string;
}

export const COUNTRY_LOCATIONS: Record<string, CountryLocationInfo> = {
  France: {
    states: [
      'Île-de-France (Paris Region)',
      'Auvergne-Rhône-Alpes',
      'Provence-Alpes-Côte d\'Azur',
      'Nouvelle-Aquitaine',
      'Occitanie',
      'Hauts-de-France',
      'Grand Est',
      'Pays de la Loire',
      'Brittany (Bretagne)',
      'Normandy (Normandie)',
      'Bourgogne-Franche-Comté',
      'Centre-Val de Loire',
      'Corsica (Corse)',
    ],
    cities: [
      { name: 'Paris', state: 'Île-de-France (Paris Region)', zip: '75001' },
      { name: 'Lyon', state: 'Auvergne-Rhône-Alpes', zip: '69001' },
      { name: 'Marseille', state: 'Provence-Alpes-Côte d\'Azur', zip: '13001' },
      { name: 'Toulouse', state: 'Occitanie', zip: '31000' },
      { name: 'Nice', state: 'Provence-Alpes-Côte d\'Azur', zip: '06000' },
      { name: 'Nantes', state: 'Pays de la Loire', zip: '44000' },
      { name: 'Strasbourg', state: 'Grand Est', zip: '67000' },
      { name: 'Montpellier', state: 'Occitanie', zip: '34000' },
      { name: 'Bordeaux', state: 'Nouvelle-Aquitaine', zip: '33000' },
      { name: 'Lille', state: 'Hauts-de-France', zip: '59000' },
      { name: 'Rennes', state: 'Brittany (Bretagne)', zip: '35000' },
      { name: 'Reims', state: 'Grand Est', zip: '51100' },
      { name: 'Le Havre', state: 'Normandy (Normandie)', zip: '76600' },
      { name: 'Saint-Étienne', state: 'Auvergne-Rhône-Alpes', zip: '42000' },
      { name: 'Toulon', state: 'Provence-Alpes-Côte d\'Azur', zip: '83000' },
      { name: 'Grenoble', state: 'Auvergne-Rhône-Alpes', zip: '38000' },
      { name: 'Dijon', state: 'Bourgogne-Franche-Comté', zip: '21000' },
      { name: 'Angers', state: 'Pays de la Loire', zip: '49000' },
      { name: 'Rouen', state: 'Normandy (Normandie)', zip: '76000' },
      { name: 'Amiens', state: 'Hauts-de-France', zip: '80000' },
    ],
  },
  'United Kingdom': {
    states: [
      'Greater London',
      'Greater Manchester',
      'West Midlands',
      'West Yorkshire',
      'Merseyside',
      'South Yorkshire',
      'Tyne and Wear',
      'Scotland',
      'Wales',
      'Northern Ireland',
      'East Midlands',
      'South East England',
      'South West England',
      'East of England',
    ],
    cities: [
      { name: 'London', state: 'Greater London', zip: 'EC1A 1BB' },
      { name: 'Manchester', state: 'Greater Manchester', zip: 'M1 1AG' },
      { name: 'Birmingham', state: 'West Midlands', zip: 'B1 1AA' },
      { name: 'Leeds', state: 'West Yorkshire', zip: 'LS1 1AA' },
      { name: 'Glasgow', state: 'Scotland', zip: 'G1 1AB' },
      { name: 'Liverpool', state: 'Merseyside', zip: 'L1 1AA' },
      { name: 'Edinburgh', state: 'Scotland', zip: 'EH1 1YZ' },
      { name: 'Bristol', state: 'South West England', zip: 'BS1 1AA' },
      { name: 'Sheffield', state: 'South Yorkshire', zip: 'S1 1AA' },
      { name: 'Newcastle upon Tyne', state: 'Tyne and Wear', zip: 'NE1 1AA' },
      { name: 'Belfast', state: 'Northern Ireland', zip: 'BT1 1AA' },
      { name: 'Cardiff', state: 'Wales', zip: 'CF10 1AA' },
      { name: 'Nottingham', state: 'East Midlands', zip: 'NG1 1AA' },
      { name: 'Southampton', state: 'South East England', zip: 'SO14 1AA' },
      { name: 'Leicester', state: 'East Midlands', zip: 'LE1 1AA' },
      { name: 'Coventry', state: 'West Midlands', zip: 'CV1 1AA' },
    ],
  },
  Germany: {
    states: [
      'Bavaria (Bayern)',
      'North Rhine-Westphalia (NRW)',
      'Baden-Württemberg',
      'Hesse (Hessen)',
      'Lower Saxony (Niedersachsen)',
      'Berlin',
      'Saxony (Sachsen)',
      'Hamburg',
      'Rhineland-Palatinate',
      'Schleswig-Holstein',
      'Brandenburg',
      'Saxony-Anhalt',
      'Thuringia',
      'Bremen',
      'Saarland',
      'Mecklenburg-Vorpommern',
    ],
    cities: [
      { name: 'Berlin', state: 'Berlin', zip: '10115' },
      { name: 'Munich', state: 'Bavaria (Bayern)', zip: '80331' },
      { name: 'Frankfurt am Main', state: 'Hesse (Hessen)', zip: '60311' },
      { name: 'Hamburg', state: 'Hamburg', zip: '20095' },
      { name: 'Cologne (Köln)', state: 'North Rhine-Westphalia (NRW)', zip: '50667' },
      { name: 'Stuttgart', state: 'Baden-Württemberg', zip: '70173' },
      { name: 'Düsseldorf', state: 'North Rhine-Westphalia (NRW)', zip: '40213' },
      { name: 'Leipzig', state: 'Saxony (Sachsen)', zip: '04109' },
      { name: 'Dortmund', state: 'North Rhine-Westphalia (NRW)', zip: '44135' },
      { name: 'Essen', state: 'North Rhine-Westphalia (NRW)', zip: '45127' },
      { name: 'Bremen', state: 'Bremen', zip: '28195' },
      { name: 'Dresden', state: 'Saxony (Sachsen)', zip: '01067' },
      { name: 'Hanover (Hannover)', state: 'Lower Saxony (Niedersachsen)', zip: '30159' },
      { name: 'Nuremberg (Nürnberg)', state: 'Bavaria (Bayern)', zip: '90402' },
    ],
  },
  'United States': {
    states: [
      'California',
      'Texas',
      'Florida',
      'New York',
      'Illinois',
      'Pennsylvania',
      'Ohio',
      'Georgia',
      'North Carolina',
      'Michigan',
      'New Jersey',
      'Virginia',
      'Washington',
      'Arizona',
      'Massachusetts',
      'Tennessee',
      'Indiana',
      'Missouri',
      'Maryland',
      'Wisconsin',
      'Colorado',
    ],
    cities: [
      { name: 'New York City', state: 'New York', zip: '10001' },
      { name: 'Los Angeles', state: 'California', zip: '90001' },
      { name: 'Chicago', state: 'Illinois', zip: '60601' },
      { name: 'Houston', state: 'Texas', zip: '77001' },
      { name: 'Phoenix', state: 'Arizona', zip: '85001' },
      { name: 'Philadelphia', state: 'Pennsylvania', zip: '19101' },
      { name: 'San Antonio', state: 'Texas', zip: '78201' },
      { name: 'San Diego', state: 'California', zip: '92101' },
      { name: 'Dallas', state: 'Texas', zip: '75201' },
      { name: 'Austin', state: 'Texas', zip: '78701' },
      { name: 'Miami', state: 'Florida', zip: '33101' },
      { name: 'Atlanta', state: 'Georgia', zip: '30301' },
      { name: 'Seattle', state: 'Washington', zip: '98101' },
      { name: 'San Francisco', state: 'California', zip: '94101' },
    ],
  },
  Bangladesh: {
    states: [
      'Dhaka Division',
      'Chittagong Division',
      'Sylhet Division',
      'Rajshahi Division',
      'Khulna Division',
      'Barisal Division',
      'Rangpur Division',
      'Mymensingh Division',
    ],
    cities: [
      { name: 'Dhaka', state: 'Dhaka Division', zip: '1212' },
      { name: 'Chittagong', state: 'Chittagong Division', zip: '4000' },
      { name: 'Sylhet', state: 'Sylhet Division', zip: '3100' },
      { name: 'Rajshahi', state: 'Rajshahi Division', zip: '6000' },
      { name: 'Khulna', state: 'Khulna Division', zip: '9000' },
      { name: 'Gazipur', state: 'Dhaka Division', zip: '1700' },
      { name: 'Narayanganj', state: 'Dhaka Division', zip: '1400' },
      { name: 'Comilla', state: 'Chittagong Division', zip: '3500' },
      { name: 'Cox\'s Bazar', state: 'Chittagong Division', zip: '4700' },
      { name: 'Bogra', state: 'Rajshahi Division', zip: '5800' },
      { name: 'Mymensingh', state: 'Mymensingh Division', zip: '2200' },
    ],
  },
  Belgium: {
    states: [
      'Brussels-Capital Region',
      'Flanders (Vlaanderen)',
      'Wallonia (Wallonie)',
      'Antwerp Province',
      'East Flanders',
      'West Flanders',
      'Flemish Brabant',
      'Walloon Brabant',
      'Hainaut',
      'Liège',
      'Limburg',
      'Namur',
    ],
    cities: [
      { name: 'Brussels', state: 'Brussels-Capital Region', zip: '1000' },
      { name: 'Antwerp', state: 'Flanders (Vlaanderen)', zip: '2000' },
      { name: 'Ghent', state: 'Flanders (Vlaanderen)', zip: '9000' },
      { name: 'Charleroi', state: 'Wallonia (Wallonie)', zip: '6000' },
      { name: 'Liège', state: 'Wallonia (Wallonie)', zip: '4000' },
      { name: 'Bruges', state: 'Flanders (Vlaanderen)', zip: '8000' },
      { name: 'Namur', state: 'Wallonia (Wallonie)', zip: '5000' },
      { name: 'Leuven', state: 'Flanders (Vlaanderen)', zip: '3000' },
    ],
  },
  Netherlands: {
    states: [
      'North Holland (Noord-Holland)',
      'South Holland (Zuid-Holland)',
      'Utrecht',
      'North Brabant (Noord-Brabant)',
      'Gelderland',
      'Overijssel',
      'Limburg',
      'Friesland',
      'Groningen',
      'Drenthe',
      'Zeeland',
      'Flevoland',
    ],
    cities: [
      { name: 'Amsterdam', state: 'North Holland (Noord-Holland)', zip: '1012' },
      { name: 'Rotterdam', state: 'South Holland (Zuid-Holland)', zip: '3011' },
      { name: 'The Hague (Den Haag)', state: 'South Holland (Zuid-Holland)', zip: '2511' },
      { name: 'Utrecht', state: 'Utrecht', zip: '3511' },
      { name: 'Eindhoven', state: 'North Brabant (Noord-Brabant)', zip: '5611' },
      { name: 'Tilburg', state: 'North Brabant (Noord-Brabant)', zip: '5038' },
      { name: 'Groningen', state: 'Groningen', zip: '9711' },
      { name: 'Almere', state: 'Flevoland', zip: '1315' },
      { name: 'Breda', state: 'North Brabant (Noord-Brabant)', zip: '4811' },
      { name: 'Nijmegen', state: 'Gelderland', zip: '6511' },
    ],
  },
  Spain: {
    states: [
      'Community of Madrid',
      'Catalonia (Catalunya)',
      'Andalusia (Andalucía)',
      'Valencian Community',
      'Galicia',
      'Basque Country (País Vasco)',
      'Castile and León',
      'Canary Islands',
      'Balearic Islands',
      'Aragon',
    ],
    cities: [
      { name: 'Madrid', state: 'Community of Madrid', zip: '28001' },
      { name: 'Barcelona', state: 'Catalonia (Catalunya)', zip: '08001' },
      { name: 'Valencia', state: 'Valencian Community', zip: '46001' },
      { name: 'Seville (Sevilla)', state: 'Andalusia (Andalucía)', zip: '41001' },
      { name: 'Zaragoza', state: 'Aragon', zip: '50001' },
      { name: 'Málaga', state: 'Andalusia (Andalucía)', zip: '29001' },
      { name: 'Bilbao', state: 'Basque Country (País Vasco)', zip: '48001' },
    ],
  },
  Italy: {
    states: [
      'Lombardy (Lombardia)',
      'Lazio (Rome)',
      'Campania (Naples)',
      'Veneto',
      'Piedmont (Piemonte)',
      'Emilia-Romagna',
      'Tuscany (Toscana)',
      'Sicily (Sicilia)',
      'Apulia (Puglia)',
    ],
    cities: [
      { name: 'Rome (Roma)', state: 'Lazio (Rome)', zip: '00118' },
      { name: 'Milan (Milano)', state: 'Lombardy (Lombardia)', zip: '20121' },
      { name: 'Naples (Napoli)', state: 'Campania (Naples)', zip: '80121' },
      { name: 'Turin (Torino)', state: 'Piedmont (Piemonte)', zip: '10121' },
      { name: 'Bologna', state: 'Emilia-Romagna', zip: '40121' },
      { name: 'Florence (Firenze)', state: 'Tuscany (Toscana)', zip: '50121' },
      { name: 'Venice (Venezia)', state: 'Veneto', zip: '30121' },
      { name: 'Genoa (Genova)', state: 'Liguria', zip: '16121' },
    ],
  },
  Ireland: {
    states: [
      'Leinster',
      'Munster',
      'Connacht',
      'Ulster (Republic of Ireland)',
      'County Dublin',
      'County Cork',
      'County Galway',
      'County Limerick',
    ],
    cities: [
      { name: 'Dublin', state: 'County Dublin', zip: 'D01' },
      { name: 'Cork', state: 'County Cork', zip: 'T12' },
      { name: 'Galway', state: 'County Galway', zip: 'H91' },
      { name: 'Limerick', state: 'County Limerick', zip: 'V94' },
      { name: 'Waterford', state: 'Munster', zip: 'X91' },
    ],
  },
  Poland: {
    states: [
      'Masovian (Mazowieckie)',
      'Silesian (Śląskie)',
      'Lesser Poland (Małopolskie)',
      'Lower Silesian (Dolnośląskie)',
      'Greater Poland (Wielkopolskie)',
      'Pomeranian (Pomorskie)',
      'Łódź (Łódzkie)',
    ],
    cities: [
      { name: 'Warsaw (Warszawa)', state: 'Masovian (Mazowieckie)', zip: '00-001' },
      { name: 'Kraków', state: 'Lesser Poland (Małopolskie)', zip: '30-001' },
      { name: 'Wrocław', state: 'Lower Silesian (Dolnośląskie)', zip: '50-001' },
      { name: 'Gdańsk', state: 'Pomeranian (Pomorskie)', zip: '80-001' },
      { name: 'Poznań', state: 'Greater Poland (Wielkopolskie)', zip: '60-001' },
      { name: 'Katowice', state: 'Silesian (Śląskie)', zip: '40-001' },
    ],
  },
  Canada: {
    states: [
      'Ontario',
      'Quebec',
      'British Columbia',
      'Alberta',
      'Manitoba',
      'Saskatchewan',
      'Nova Scotia',
      'New Brunswick',
    ],
    cities: [
      { name: 'Toronto', state: 'Ontario', zip: 'M5H 2N2' },
      { name: 'Montreal', state: 'Quebec', zip: 'H2Y 1C6' },
      { name: 'Vancouver', state: 'British Columbia', zip: 'V6B 1A1' },
      { name: 'Calgary', state: 'Alberta', zip: 'T2P 1J9' },
      { name: 'Ottawa', state: 'Ontario', zip: 'K1P 1J1' },
      { name: 'Edmonton', state: 'Alberta', zip: 'T5J 0N3' },
    ],
  },
  Australia: {
    states: [
      'New South Wales',
      'Victoria',
      'Queensland',
      'Western Australia',
      'South Australia',
      'Tasmania',
      'Australian Capital Territory',
    ],
    cities: [
      { name: 'Sydney', state: 'New South Wales', zip: '2000' },
      { name: 'Melbourne', state: 'Victoria', zip: '3000' },
      { name: 'Brisbane', state: 'Queensland', zip: '4000' },
      { name: 'Perth', state: 'Western Australia', zip: '6000' },
      { name: 'Adelaide', state: 'South Australia', zip: '5000' },
      { name: 'Canberra', state: 'Australian Capital Territory', zip: '2600' },
    ],
  },
};

export function getStatesForCountry(countryName: string): string[] {
  if (!countryName) return [];
  const normalized = countryName.trim();
  const match = Object.keys(COUNTRY_LOCATIONS).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );
  return match ? COUNTRY_LOCATIONS[match].states : [];
}

export function getCitiesForCountry(countryName: string, stateFilter?: string): CityLocation[] {
  if (!countryName) return [];
  const normalized = countryName.trim();
  const match = Object.keys(COUNTRY_LOCATIONS).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );
  if (!match) return [];

  const allCities = COUNTRY_LOCATIONS[match].cities;
  if (!stateFilter || !stateFilter.trim()) {
    return allCities;
  }

  const sNorm = stateFilter.toLowerCase().trim();
  const filtered = allCities.filter(
    (c) => c.state && (c.state.toLowerCase().includes(sNorm) || sNorm.includes(c.state.toLowerCase()))
  );
  return filtered.length > 0 ? filtered : allCities;
}
