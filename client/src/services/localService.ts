export const USERNAME_KEY = "username";
export const PASSWORD_KEY = "password";

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

storeCredentials("maulik_kanzariya", "maulik@123");
storeCredentials("nandkishor_dhadhal", "nandkishor@123");
storeCredentials("hemanshi_garnara", "hemanshi@123");
storeCredentials("dhruv_vyas", "dhruv@123");
