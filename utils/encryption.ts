import CryptoJS from "crypto-js"

// In a real application, you would use a more secure approach
// This is a simplified example for demonstration purposes
const SECRET_KEY = "github-analyzer-secret-key"

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
