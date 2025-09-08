import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "../config/api.config";
import type { Genre, CreateGenreDTO } from "../types/Genre";

export const genreService = {
  async getGenres(): Promise<Genre[]> {
    const response = await axiosInstance.get(`${API_BASE_URL}/genres`);
    return response.data;
  },

  async createGenre(genre: CreateGenreDTO): Promise<Genre> {
    const response = await axiosInstance.post(`${API_BASE_URL}/genres`, genre);
    return response.data;
  },
};

export const searchGenres = async (searchTerm: string) => {
  const response = await axiosInstance.get("/genres", {
    params: { search: searchTerm },
  });
  return response.data;
};
