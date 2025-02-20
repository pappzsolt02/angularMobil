export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageBase64: string | undefined;
}
