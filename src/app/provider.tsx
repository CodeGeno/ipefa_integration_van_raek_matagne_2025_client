"use client";
import { Account } from "@/model/entity/users/account.entity";
import { AccountContext } from "./context";
import { useEffect, useState } from "react";

interface UserData {
  token: string;
  user?: Account;
}

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    setUserData({
      token: token || "",
      user: userStr ? JSON.parse(userStr) : null,
    });
    console.log(userData);
  }, []);

  return (
    <AccountContext.Provider value={[userData, setUserData]}>
      {children}
    </AccountContext.Provider>
  );
};

export default AppProvider;
