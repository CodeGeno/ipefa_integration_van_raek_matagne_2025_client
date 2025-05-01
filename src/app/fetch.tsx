"use client";
import { BASE_URL } from "@/lib/url";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AccountContext } from "./context";
import { Employee } from "@/model/entity/lessons/employee.entity";
import { ApiResponse } from "@/model/api/api.response";

// src/app/fetch.ts
const myFetch = async <T,>(
	url: string,
	options?: RequestInit
): Promise<ApiResponse<T>> => {
	const token = localStorage.getItem("token");

	const response = await fetch(BASE_URL + url, {
		...options,

		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status === 403 || response.status === 401) {
		window.alert(
			"Accès non autorisé - redirection vers la page de connexion"
		);
		window.location.href = "/login";
	}
	return response.json() as Promise<ApiResponse<T>>;
};

// Fonction pour obtenir le token depuis le localStorage

// Méthode GET
const get = async <T,>(url: string): Promise<ApiResponse<T>> => {
	try {
		return myFetch<T>(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return {
			success: false,
			message: "Erreur lors de la récupération des données",
			data: undefined,
			status: 500,
		};
	}
};

// Méthode POST
const post = async <T,>(url: string, data: any): Promise<ApiResponse<T>> => {
	return myFetch<T>(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
};

// Méthode DELETE
const del = async <T,>(url: string): Promise<ApiResponse<T>> => {
	return myFetch<T>(url, {
		method: "DELETE",
		headers: {},
	});
};

const patch = async <T,>(url: string, data: any): Promise<ApiResponse<T>> => {
	return myFetch<T>(url, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
};

export { get, post, del, patch };
