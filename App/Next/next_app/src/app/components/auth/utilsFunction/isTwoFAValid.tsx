

const isTwoFAValid = async (inputValue: string, url: string) : Promise<boolean> => {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ code: inputValue }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch \'verifyTwoFA');
    }
    const data = await response.json();
    return data;
}

export default isTwoFAValid;
