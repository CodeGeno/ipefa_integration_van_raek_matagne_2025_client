"use client";

import {
	ApiResponse,
	ApiSuccess,
	ApiError,
	ApiPaginatedResponse,
} from "@/model/api/api.response";
import { BASE_URL } from "@/lib/url";
import { PaginationWithSearch } from "@/model/common/pagination.interface";
// src/app/fetch.ts
const myFetch = async <T,>(
	url: string,
	options?: RequestInit
): Promise<ApiResponse<T>> => {
	const token = localStorage.getItem("token");
	const role = localStorage.getItem("role");
	try {
		const response = await fetch(BASE_URL + url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		if (response.status === 401) {
			alert("Vous n'êtes pas autorisé à accéder à cette page");
			window.location.href = "/";
		}
		return data as ApiSuccess<T>;
	} catch (error) {
		console.log(error);
		return {
			success: false,
			message: "Erreur lors de la récupération des données",
			data: undefined,
			status: 500,
		} as ApiError<T>;
	}
};

// Fonction pour obtenir le token depuis le localStorage

// Méthode GET
const get = async <T,>(url: string): Promise<ApiResponse<T>> => {
	return myFetch<T>(url, {
		method: "GET",
	});
};
const getPaginated = async <T,>(
	url: string,
	options?: RequestInit
): Promise<ApiPaginatedResponse<T>> => {
	const token = localStorage.getItem("token");

	try {
		const response = await fetch(BASE_URL + url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		return data as ApiPaginatedResponse<T>;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
// Méthode POST
const post = async <T,>(url: string, data: any): Promise<ApiResponse<T>> => {
	return myFetch<T>(url, {
		method: "POST",
		body: JSON.stringify(data),
	});
};

// Méthode DELETE
const del = async <T,>(url: string): Promise<ApiResponse<T>> => {
	return myFetch<T>(url, {
		method: "DELETE",
	});
};

const patch = async <T,>(url: string, data: any): Promise<ApiResponse<T>> => {
	return myFetch<T>(url, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
};

export { get, getPaginated, post, del, patch };
