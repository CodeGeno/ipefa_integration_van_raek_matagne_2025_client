"use client";
import { BASE_URL } from "@/lib/url";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AccountContext } from "./context";

// src/app/fetch.ts
const myFetch: typeof fetch = async (url, options) => {
  const token = localStorage.getItem("token");

  const response = await fetch(BASE_URL + url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("zzzzz", response);

  if (response.status === 403 || response.status === 401) {
    window.alert("Accès non autorisé - redirection vers la page de connexion");
    window.location.href = "/login";
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
