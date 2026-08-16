import rawData from '../../assets/data/properties.json';
import { Habitat, RawHabitat } from '../types/habitat';
import { parseHabitat } from '../utils/parseHabitat';

let cachedHabitats: Habitat[] | null = null;

export async function fetchHabitats(): Promise<Habitat[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (cachedHabitats) {
    return cachedHabitats;
  }

  try {
    cachedHabitats = (rawData as RawHabitat[]).map((item) => parseHabitat(item));
    return cachedHabitats;
  } catch {
    throw new Error('Failed to load habitat data');
  }
}

export function getHabitatById(id: string): Habitat | undefined {
  return cachedHabitats?.find((habitat) => habitat.id === id);
}

export function clearHabitatCache(): void {
  cachedHabitats = null;
}
