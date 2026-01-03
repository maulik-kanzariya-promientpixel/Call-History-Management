export const USERNAME_KEY = "username";
export const PASSWORD_KEY = "password";
export const LOGIN_STATUS = "loginStatus";

export function storeCredentials(username: string, password: string): void {
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, password);
}

export function getStoredCredentials(): {
  username: string | null;
  password: string | null;
} {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
  };
}

export function setLoginStatus(status: boolean) {
  localStorage.setItem(LOGIN_STATUS, String(status));
}

export function getLoginStatus(): boolean {
  return localStorage.getItem(LOGIN_STATUS) === "true";
}

// Seed credentials (for demo)
storeCredentials("maulik_kanzariya", "maulik@123");
