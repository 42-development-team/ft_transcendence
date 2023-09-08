
const generateTwoFA = async (url: string, userId: string, setImageUrl = (data: any) => {}) => {
    try {
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({code: "test", userId: userId}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        setImageUrl(data.base64Qrcode);
    }
    catch (error) {
        console.error('Error retrieving image URL:', error);
    }
}

export default generateTwoFA;