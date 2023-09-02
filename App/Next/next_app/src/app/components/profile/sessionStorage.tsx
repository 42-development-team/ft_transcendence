'use client';

const sessionStorageUser = () => {
	return (sessionStorage.getItem("userId"));
}

export default sessionStorageUser;
