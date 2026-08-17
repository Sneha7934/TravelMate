export function getStoredUserId() {
  try {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id ?? user?.userId;

    if (userId !== null && userId !== undefined) {
      const value = String(userId);
      localStorage.setItem("userId", value);
      return value;
    }
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
  }

  return localStorage.getItem("userId");
}
