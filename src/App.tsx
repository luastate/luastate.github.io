import { useState } from "react";

import axios from "axios";

let templateId = "";
let location = "";

function App() {
    const [inputValue, setInputValue] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    function extractId(text: string) {
        const idRegex = /\?id=([^\s&]+)(?=<\/url>)/;
        const match = text.match(idRegex);
        return match![1];
    }

    async function downloadImage(assetId: string) {
        try {
            const response1 = await axios.get(
                `https://assetdelivery.roproxy.com/v2/assetId/${assetId}`
            );
            console.log(response1);
            location = response1.data.locations[0].location;
            const response2 = await axios.get(location);
            templateId = extractId(response2.data);
            const response3 = await axios.get(
                `https://assetdelivery.roproxy.com/v2/assetId/${templateId}`
            );
            setImageUrl(response3.data.locations[0].location);
            console.log(imageUrl);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    }

    const handleChange = (event: any) => {
        setInputValue(event.target.value);
        console.log(event.target.value)
        downloadImage(event.target.value);
    };

    return (
        <div className="flex justify-center items-center flex-col bg-blue-400 text-white min-h-screen">
            <h1 className="text-3xl p-2">Get Clothing Asset</h1>

            <label className="p-2">Clothing ID: {inputValue}</label>

            <input
                type="text"
                value={inputValue}
                className="p-2 text-black"
                onChange={handleChange}
                placeholder="Type and press Enter"
            />

            {imageUrl && (
                <div>
                    <h1>Template:</h1>
                    <img src={imageUrl} alt="Image here" />
                </div>
            )}
        </div>
    );
}

export default App;
