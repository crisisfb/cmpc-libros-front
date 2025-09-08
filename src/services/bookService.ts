import axiosInstance from "./axiosInstance";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api.config";
import type {
  Book,
  PaginatedBooksResponse,
  CreateBookDTO,
} from "../types/Book";

export const bookService = {
  async getBooks(page: number, limit: number): Promise<PaginatedBooksResponse> {
    const response = await axiosInstance.get(
      `${API_BASE_URL}${API_ENDPOINTS.books}?page=${page + 1}&limit=${limit}`,
    );
    return response.data;
  },

  async getBook(id: number): Promise<Book> {
    const response = await axiosInstance.get(
      `${API_BASE_URL}${API_ENDPOINTS.books}/${id}`,
    );
    return response.data;
  },

  async createBook(book: CreateBookDTO): Promise<Book> {
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("author", book.author);
    formData.append("publisher", book.publisher);
    formData.append("price", book.price.toString());
    formData.append("availability", book.availability.toString());
    formData.append("genre", book.genre);

    // Append either the image file or the image URL
    if (book.image) {
      formData.append("image", book.image);
    } else if (book.imageUrl) {
      formData.append("imageUrl", book.imageUrl);
    }

    const response = await axiosInstance.post(
      `${API_BASE_URL}${API_ENDPOINTS.books}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async updateBook(id: number, book: CreateBookDTO): Promise<Book> {
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("author", book.author);
    formData.append("publisher", book.publisher);
    formData.append("price", book.price.toString());
    formData.append("availability", book.availability.toString());
    formData.append("genre", book.genre);

    // Append either the image file or the image URL
    if (book.image) {
      formData.append("image", book.image);
    } else if (book.imageUrl) {
      formData.append("imageUrl", book.imageUrl);
    }

    const response = await axiosInstance.put(
      `${API_BASE_URL}${API_ENDPOINTS.books}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async exportToCsv(): Promise<Blob> {
    const response = await axiosInstance.get(
      `${API_BASE_URL}${API_ENDPOINTS.books}/export/csv`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  async importCsv(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await axiosInstance.post(
      `${API_BASE_URL}${API_ENDPOINTS.books}/import/csv`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
