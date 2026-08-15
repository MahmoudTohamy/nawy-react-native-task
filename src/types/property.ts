export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  imageUrl: string | null;
  description: string;
  amenities: string[];
  status: string;
  listedAt: string;
}

// Quick mapping carried over from the Earth demo.
export function parseProperty(json: any): Property {
  return {
    id: json.id as string,
    title: json.title as string,
    price: json.price as number,
    currency: json.currency as string,
    address: json.address as string,
    bedrooms: json.bedrooms as number,
    bathrooms: json.bathrooms as number,
    area: json.area as number,
    areaUnit: json.area_unit as string,
    imageUrl: json.image_url as string | null,
    description: json.description as string,
    amenities: (json.amenities as string[]) ?? [],
    status: json.status as string,
    listedAt: json.listed_at as string,
  };
}
