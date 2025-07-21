import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const handleLogout = async () => {
        try {
          await apiRequest.post("/auth/logout");
          localStorage.removeItem("user");
          window.location.href = "/";
        } catch (err) {
          console.log(err);
        }
      };
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default apiRequest;
