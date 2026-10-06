import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage, auth } from "./config.ts";

export interface UploadProgressCallback {
  (percentage: number): void;
}

/**
 * Uploads a file to Firebase Storage under the specified directory path.
 * Returns the public download URL once upload is complete.
 */
export async function uploadChurchAsset(
  file: File,
  folder = "church_media",
  onProgress?: UploadProgressCallback
): Promise<string> {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Validate authentication before storage operation
  if (!auth.currentUser) {
    throw new Error("You must be signed in with an email account or Google to upload files to Firebase Storage.");
  }

  // Sanitize filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${folder}/${Date.now()}_${cleanName}`;
  const fileRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type || "image/jpeg",
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error("Firebase Storage Upload Error:", error);
        let errorMsg = error.message;
        if (error.code === "storage/unauthorized") {
          errorMsg = "Firebase Storage permission denied. Please verify your Firebase Storage security rules allow authenticated users to write.";
        } else if (error.code === "storage/bucket-not-found") {
          errorMsg = "Firebase Storage bucket could not be found. Check your Firebase Storage configuration.";
        } else if (error.code === "storage/quota-exceeded") {
          errorMsg = "Firebase Storage quota exceeded.";
        }
        reject(new Error(errorMsg));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (urlError) {
          reject(urlError);
        }
      }
    );
  });
}
