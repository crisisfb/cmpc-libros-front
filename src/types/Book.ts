export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  price: number;
  availability: number;
  genre: string;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  publisher: string;
  price: number;
  availability: number;
  genre: string;
}

export interface BookResponse {
  rows: Book[];
  count: number;
}
