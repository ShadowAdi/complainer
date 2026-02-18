/**
 * Upload a single image file to UploadThing
 * @param file - The file buffer to upload
 * @param fileName - Name of the file
 * @returns Promise<string> - The URL of the uploaded file
 */
export declare function uploadImageToUploadThing(file: Buffer, fileName: string): Promise<string>;
/**
 * Delete an image from UploadThing
 * @param fileUrl - The URL of the file to delete
 * @returns Promise<void>
 */
export declare function deleteImageFromUploadThing(fileUrl: string): Promise<void>;
