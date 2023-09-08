

const isTwoFAValid = async (inputValue: string, userId: string, url: string) : Promise<boolean> => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ code: inputValue, userId: userId }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default isTwoFAValid;
