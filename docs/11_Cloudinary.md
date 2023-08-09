[Home Page](./00_Documentation.md)
# CLOUDINARY => Avatar handling

* Temporary URL (Frontend): Used only for previewing the image locally in the browser before the form is submitted. Not stored in Cloudinary.

* Cloudinary URL (Backend => JWT token): The actual URL of the image stored on Cloudinary's servers. This URL is used to display the image whenever needed, and it isassociated with the user's JWT token to link the user's account with their avatar image.
