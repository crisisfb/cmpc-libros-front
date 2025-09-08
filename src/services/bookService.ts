import axiosInstance from "./axiosInstance";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api.config";
import type {
  Book,
  PaginatedBooksResponse,
  CreateBookDTO,
} from "../types/Book";
import type { FilterItem } from "../types/Filter";
import type { GridSortModel } from "@mui/x-data-grid";

export const bookService = {
  async getBooks(
    page: number,
    limit: number,
    filters?: FilterItem[],
    sortModel?: GridSortModel
  ): Promise<PaginatedBooksResponse> {
    let url = `${API_BASE_URL}${API_ENDPOINTS.books}?page=${page + 1}&limit=${limit}`;
    
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.operator === 'isEmpty') {
          url += `&${filter.field}[isEmpty]=true`;
        } else if (filter.operator === 'isNotEmpty') {
          url += `&${filter.field}[isNotEmpty]=true`;
        } else if (filter.operator === 'isAnyOf' && Array.isArray(filter.value)) {
          filter.value.forEach((val) => {
            url += `&${filter.field}[in][]=${encodeURIComponent(val)}`;
          });
        } else if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          const operator = filter.operator === 'doesNotContain' ? 'notContains' :
                          filter.operator === 'doesNotEqual' ? 'notEquals' :
                          filter.operator;
          url += `&${filter.field}[${encodeURIComponent(operator)}]=${encodeURIComponent(filter.value)}`;
        }
      });
    }

    if (sortModel && sortModel.length > 0) {
      sortModel.forEach((sortItem) => {
        url += `&sort[${sortItem.field}]=${sortItem.sort === 'asc' ? 'ASC' : 'DESC'}`;
      });
    }
    
    const response = await axiosInstance.get(url);
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
    async deleteBook(id: number): Promise<void> {
      await axiosInstance.delete(`${API_BASE_URL}${API_ENDPOINTS.books}/${id}`);
    },
};
