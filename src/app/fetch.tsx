"use client";
import { BASE_URL } from "@/lib/url";

// src/app/fetch.ts
const myFetch: typeof fetch = async (url, options) => {
	const token = localStorage.getItem("token");
	const role = localStorage.getItem("role");
	const response = await fetch(BASE_URL + url, {
		...options,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	if (!response.ok) {
		if (response.status === 401) {
			console.error("Unauthorized access - redirecting to login");
		}
		console.log(response);
	}
	return response;
};

// Fonction pour obtenir le token depuis le localStorage

// Méthode GET
const get = async (url: string) => {
	return myFetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

// Méthode POST
const post = async (url: string, data: any) => {
	return myFetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
};

// Méthode DELETE
const del = async (url: string) => {
	return myFetch(url, {
		method: "DELETE",
		headers: {},
	});
};

export { get, post, del, myFetch };
