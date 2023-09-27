/*
after the avatar image is uploaded to the back-end and 
the imageUrl is sent with the response, 
we update the state with the Cloudinary URL
*/

const UpdateAvatar = async (
    avatarFile: File | null,
    userId: string,
    setImageUrl: any
) => {
    let avatarUrl = null;
    if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("userID", userId);
        const response = await fetch(`${process.env.BACK_URL}/avatars/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.log("Error response status:", response.status);
            console.log("Error response text:", await response.text());
        } else {
            const data = await response.json();
            avatarUrl = data.imageUrl;
            setImageUrl(avatarUrl);
        }
    }
}

export default UpdateAvatar;