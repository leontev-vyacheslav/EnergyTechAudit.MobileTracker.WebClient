export type ClusterModel = {
  id: number,
  index: number,
  centroid: google.maps.LatLngBounds | google.maps.LatLng | null,
  radius: number,
  elements: any[],
  count: number,
  addresses: string[],
  speed: number,
  accuracy: number
}
