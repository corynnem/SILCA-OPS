"use client"

import React, { useEffect } from "react";
import Login from "@/components/Auth/Login";
import { useContext } from "react";
import { useLoggedIn } from "@/context/LoggedInContext";
import { redirect } from "next/navigation";


const LoginPage = () => {
    const { userData, isLoggedIn } = useLoggedIn()

    return (
        <Login/>
    )
}

export default LoginPage;