export const setToken = (token: string) => {
  document.cookie = `token=${token}; path=/`;
};

export const getToken = () => {
  if (typeof document === "undefined") return "";

  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

  return tokenCookie ? tokenCookie.split("=")[1] : "";
};

export const removeToken = () => {
  document.cookie = "token=; path=/; max-age=0";
};