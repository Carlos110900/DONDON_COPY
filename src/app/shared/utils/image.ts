/** Reduce la imagen y la devuelve como data URL JPEG, para guardarla en db.json. */
export async function compressImage(file: File, maxWidth = 600, quality = 0.85): Promise<string> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    throw new Error('No se pudo procesar la imagen seleccionada.');
  }
}
