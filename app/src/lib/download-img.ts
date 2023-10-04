import axios from "axios";

// Function to download an image from a URL
export async function downloadImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
}
