
const generateTwoFA = async (url: string, setImageUrl = (data: any) => {}) => {
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch \'turn-on');
        }
        const data = await response.json();
        setImageUrl(data.base64Qrcode);
    }
    catch (error) {
        console.error('Error retrieving image URL:', error);
    }
}

export default generateTwoFA;