import api from "@/lib/api";

export const fetcher = {
  get: (url: string) => {
    return api.get(url).then((res) => res.data);
  },
  post: (url: string, data: any) => {
    return api.post(url, data).then((res) => res.data);
  },
  put: (url: string, data: any) => {
    return api.put(url, data).then((res) => res.data);
  },
  delete: (url: string) => {
    return api.delete(url).then((res) => res.data);
  },
};
