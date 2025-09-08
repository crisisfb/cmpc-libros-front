export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  price: string | number;
  availability: number;
  genre: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  publisher: string;
  price: number;
  availability: number;
  genre: string;
  imageUrl?: string;
  image?: File;
}

export interface PaginatedBooksResponse {
  count: number;
  rows: Book[];
}
