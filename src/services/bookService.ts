import axiosInstance from './axiosInstance';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import type { Book, BookResponse, CreateBookDTO } from '../types/Book';

export const bookService = {
  async getBooks(page: number, limit: number): Promise<BookResponse> {
    const response = await axiosInstance.get(`${API_BASE_URL}${API_ENDPOINTS.books}?page=${page + 1}&limit=${limit}`);
    return response.data;
  },

  async getBook(id: number): Promise<Book> {
    const response = await axiosInstance.get(`${API_BASE_URL}${API_ENDPOINTS.books}/${id}`);
    return response.data;
  },

  async createBook(book: CreateBookDTO): Promise<Book> {
    const response = await axiosInstance.post(`${API_BASE_URL}${API_ENDPOINTS.books}`, book);
    return response.data;
  },

  async exportToCsv(): Promise<Blob> {
    const response = await axiosInstance.get(`${API_BASE_URL}${API_ENDPOINTS.books}/export/csv`, {
      responseType: 'blob'
    });
    return response.data;
  },
};
