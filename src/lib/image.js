// Downscale photos so they fit comfortably in localStorage for now.
// TODO: move observations + full-size photos to IndexedDB.
const MAX_BYTES = 25 * 1024 * 1024;

/** Returns a human-readable problem, or null if the file looks usable. */
export function validateImage(file) {
  if (!file.type.startsWith('image/')) return 'That file is not an image. Choose a JPEG, PNG or WebP photo.';
  if (file.size > MAX_BYTES) return 'That photo is larger than 25 MB. Try a smaller one.';
  return null;
}

export function fileToThumb(file, max = 640) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('We could not read that image. HEIC photos may not work in this browser, so try a JPEG or PNG.'));
    };
    img.src = url;
  });
}
