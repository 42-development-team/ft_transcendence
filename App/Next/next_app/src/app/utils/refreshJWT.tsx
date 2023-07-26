"use client";

export const refreshToken = async() => {
    await fetch(`${process.env.BACK_URL}/auth/refresh/`, { credentials: 'include' }).catch((error) => {
        console.log(error);
    });
}