import * as ExpoSecureStore from "expo-secure-store";

export async function storeSecure(key, val) {
  await ExpoSecureStore.setItemAsync(key, val);
}

export async function getSecure(key) {
  return await ExpoSecureStore.getItemAsync(key);
}

export async function deleteSecure(key) {
  await ExpoSecureStore.deleteItemAsync(key);
}