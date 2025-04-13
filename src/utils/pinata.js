import axios from "axios";

const PINATA_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({ name: file.name });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({ cidVersion: 1 });
    formData.append("pinataOptions", options);

    try {
        const response = await axios.post(PINATA_UPLOAD_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "pinata_api_key": process.env.REACT_APP_PINATA_API_KEY,
                "pinata_secret_api_key": process.env.REACT_APP_PINATA_SECRET,
            },
        });

        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
};
