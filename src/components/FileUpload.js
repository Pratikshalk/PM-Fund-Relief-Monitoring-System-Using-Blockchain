import React, { useState } from "react";
import { uploadToPinata } from "../utils/pinata";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [cid, setCid] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }
        const ipfsHash = await uploadToPinata(file);
        if (ipfsHash) {
            setCid(ipfsHash);
        }
    };

    return (
        <div>
            <h2>Upload File to Pinata</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {cid && (
                <p>
                    File CID: <a href={`https://gateway.pinata.cloud/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">{cid}</a>
                </p>
            )}
        </div>
    );
};

export default FileUpload;
