import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "../config/api.config";
import type { Publisher, CreatePublisherDTO } from "../types/Publisher";

export const publisherService = {
  async getPublishers(): Promise<Publisher[]> {
    const response = await axiosInstance.get(`${API_BASE_URL}/publishers`);
    return response.data;
  },

  async createPublisher(publisher: CreatePublisherDTO): Promise<Publisher> {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/publishers`,
      publisher,
    );
    return response.data;
  },
};

export const searchPublishers = async (searchTerm: string) => {
  const response = await axiosInstance.get("/publishers", {
    params: { search: searchTerm },
  });
  return response.data;
};
