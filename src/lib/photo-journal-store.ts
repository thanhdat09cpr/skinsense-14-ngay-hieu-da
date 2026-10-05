/**
 * Day photos stored only in this browser (IndexedDB). Nothing here talks to a
 * server: the campaign promise is that skin photos never leave the device.
 * Every call fails soft (returns null/false) when storage is unavailable.
 */

const DB_NAME = "skinsense-14-ngay-photos";
const STORE = "photos";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const request = action(db.transaction(STORE, mode).objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

export async function savePhoto(day: number, blob: Blob): Promise<boolean> {
  try {
    await run("readwrite", (store) => store.put(blob, day));
    return true;
  } catch {
    return false;
  }
}

export async function loadPhoto(day: number): Promise<Blob | null> {
  try {
    const result = await run<Blob | undefined>("readonly", (store) => store.get(day));
    return result ?? null;
  } catch {
    return null;
  }
}

export async function deletePhoto(day: number): Promise<void> {
  try {
    await run("readwrite", (store) => store.delete(day));
  } catch {
    // Nothing stored or storage blocked.
  }
}

export async function clearPhotos(): Promise<void> {
  try {
    await run("readwrite", (store) => store.clear());
  } catch {
    // Nothing stored or storage blocked.
  }
}

/**
 * Shrinks a camera photo to at most 1280px on its long side (JPEG), so 14 days
 * of photos stay around a few MB. Respects EXIF orientation.
 */
export async function compressPhoto(file: File, maxSide = 1280, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Photo export failed"))), "image/jpeg", quality);
  });
}
