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
            console.log("Avatar URL from Cloudinary:", avatarUrl);
            setImageUrl(avatarUrl);
        }
    }
}

export default UpdateAvatar;