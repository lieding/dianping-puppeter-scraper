const Endpoint = 'https://api-adresse.data.gouv.fr/search';

export interface IFeature {
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {}
}

export async function getCoordinateByAddress (address: string) {
  address = address.replace(/[\u4e00-\u9fa5]/g, '').replace(/\(.*?\)/g, '');
  console.log(address);
  const res = await fetch(`${Endpoint}?q=${encodeURIComponent(address)}&limit=4`).then(res => res.json());
  let features = res.features as IFeature[];
  if (!features?.length) return null;
  features = features
    .filter(it => it.geometry.type === 'Point' && it.geometry.coordinates.length === 2);
  return features?.[0].geometry.coordinates;
}