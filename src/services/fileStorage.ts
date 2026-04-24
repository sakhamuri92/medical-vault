import * as FileSystem from 'expo-file-system/legacy';

const DOCUMENTS_DIR = `${FileSystem.documentDirectory}documents/`;

export async function ensureDirectoryExists(memberId: string, documentId: string): Promise<string> {
  const year = new Date().getFullYear();
  const dir = `${DOCUMENTS_DIR}${memberId}/${year}/${documentId}/`;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  return dir;
}

export async function saveDocumentImage(
  memberId: string,
  documentId: string,
  pageIndex: number,
  sourceUri: string,
): Promise<string> {
  const dir = await ensureDirectoryExists(memberId, documentId);
  const dest = `${dir}page${pageIndex}.jpg`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}

export async function deleteDocumentImages(memberId: string, documentId: string): Promise<void> {
  const year = new Date().getFullYear();
  const dir = `${DOCUMENTS_DIR}${memberId}/${year}/${documentId}/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (info.exists) {
    await FileSystem.deleteAsync(dir, { idempotent: true });
  }
}
