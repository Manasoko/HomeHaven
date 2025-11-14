export type Image = {
    id: number;
    url: string;
}

export interface PropertyType {
    images: Image[];
    description: string;
    price: number;
    address: string;
    id: number;
    bedRoomNo?: number;
    bathRoomNo?: number;
}