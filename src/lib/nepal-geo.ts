/**
 * Nepal Geographic & Delivery Zone Data
 * Covers all 7 Provinces, 77 Districts, and zone-based shipping calculations
 */

export interface ProvinceData {
  id: string;
  nameEn: string;
  nameNe: string;
  districts: string[];
}

export const NEPAL_PROVINCES: ProvinceData[] = [
  {
    id: 'koshi',
    nameEn: 'Koshi Province',
    nameNe: 'कोशी प्रदेश',
    districts: [
      'Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga',
      'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'
    ]
  },
  {
    id: 'madhesh',
    nameEn: 'Madhesh Province',
    nameNe: 'मधेश प्रदेश',
    districts: [
      'Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'
    ]
  },
  {
    id: 'bagmati',
    nameEn: 'Bagmati Province',
    nameNe: 'बागमती प्रदेश',
    districts: [
      'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha',
      'Kavrepalanchok', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'
    ]
  },
  {
    id: 'gandaki',
    nameEn: 'Gandaki Province',
    nameNe: 'गण्डकी प्रदेश',
    districts: [
      'Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang',
      'Myagdi', 'Nawalpur', 'Parbat', 'Syangja', 'Tanahun'
    ]
  },
  {
    id: 'lumbini',
    nameEn: 'Lumbini Province',
    nameNe: 'लुम्बिनी प्रदेश',
    districts: [
      'Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu',
      'Parasi', 'Palpa', 'Pyuthan', 'Rolpa', 'Rukum East', 'Rupandehi'
    ]
  },
  {
    id: 'karnali',
    nameEn: 'Karnali Province',
    nameNe: 'कर्णाली प्रदेश',
    districts: [
      'Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot',
      'Mugu', 'Salyan', 'Surkhet', 'Rukum West'
    ]
  },
  {
    id: 'sudurpashchim',
    nameEn: 'Sudurpashchim Province',
    nameNe: 'सुदूरपश्चिम प्रदेश',
    districts: [
      'Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula',
      'Doti', 'Kailali', 'Kanchanpur'
    ]
  }
];

export interface DeliveryZone {
  id: string;
  nameEn: string;
  nameNe: string;
  baseRatePaisa: number; // in paisa
  estimatedDays: string;
  descriptionEn: string;
  descriptionNe: string;
}

export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  valley: {
    id: 'valley',
    nameEn: 'Kathmandu Valley (Ktm / Lalitpur / Bhaktapur)',
    nameNe: 'काठमाडौँ उपत्यका (काठमाडौँ, ललितपुर, भक्तपुर)',
    baseRatePaisa: 6000, // Rs. 60
    estimatedDays: '1 - 2 Days',
    descriptionEn: 'Fast same-day or next-day rider delivery',
    descriptionNe: 'द्रुत समान दिन वा भोलिपल्टको डेलिभरी'
  },
  major_city: {
    id: 'major_city',
    nameEn: 'Major Cities (Pokhara, Biratnagar, Butwal, etc.)',
    nameNe: 'प्रमुख शहरहरू (पोखरा, विराटनगर, बुटवल, आदि)',
    baseRatePaisa: 12000, // Rs. 120
    estimatedDays: '2 - 3 Days',
    descriptionEn: 'Courier road/air express delivery',
    descriptionNe: 'कुरियर सडक/हवाई एक्सप्रेस डेलिभरी'
  },
  rest_nepal: {
    id: 'rest_nepal',
    nameEn: 'Rest of Nepal',
    nameNe: 'नेपालका अन्य क्षेत्रहरू',
    baseRatePaisa: 18000, // Rs. 180
    estimatedDays: '3 - 5 Days',
    descriptionEn: 'Standard courier delivery to district headquarters',
    descriptionNe: 'जिल्ला सदरमुकामसम्मको स्तरीय कुरियर'
  },
  remote: {
    id: 'remote',
    nameEn: 'Remote / Mountain Districts',
    nameNe: 'दुर्गम तथा हिमाली जिल्लाहरू',
    baseRatePaisa: 25000, // Rs. 250
    estimatedDays: '5 - 7 Days',
    descriptionEn: 'Special cargo or postal delivery to remote locations',
    descriptionNe: 'दुर्गम स्थानहरूका लागि विशेष कार्गो वा हुलाक'
  }
};

/**
 * Maps a given district to its delivery zone
 */
export function getDeliveryZoneForDistrict(districtName: string): DeliveryZone {
  const valleyDistricts = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];
  const majorCityDistricts = ['Kaski', 'Morang', 'Chitwan', 'Rupandehi', 'Jhapa', 'Banke', 'Sunsari', 'Parsa'];
  const remoteDistricts = ['Manang', 'Mustang', 'Dolpa', 'Humla', 'Jumla', 'Kalikot', 'Mugu', 'Darchula', 'Bajhang', 'Bajura'];

  if (valleyDistricts.includes(districtName)) {
    return DELIVERY_ZONES.valley;
  }
  if (majorCityDistricts.includes(districtName)) {
    return DELIVERY_ZONES.major_city;
  }
  if (remoteDistricts.includes(districtName)) {
    return DELIVERY_ZONES.remote;
  }
  return DELIVERY_ZONES.rest_nepal;
}
