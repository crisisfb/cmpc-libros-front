import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "../config/api.config";
import type { Author, CreateAuthorDTO } from "../types/Author";

export const authorService = {
  async getAuthors(): Promise<Author[]> {
    const response = await axiosInstance.get(`${API_BASE_URL}/authors`);
    return response.data;
  },

  async createAuthor(author: CreateAuthorDTO): Promise<Author> {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/authors`,
      author,
    );
    return response.data;
  },

  async searchAuthors(searchTerm: string) {
    const response = await axiosInstance.get(`${API_BASE_URL}/authors`, {
      params: { search: searchTerm },
    });
    return response.data;
  },
};
