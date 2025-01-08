import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import Auth from "../Api/Auth";
import useToast from "../Hooks/UseToast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../Redux/Slices/AuthSlice";
import CircleSpinner from '../components/Spinners/CircleSpinner'

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors }, setError, } = useForm()
    const [data, setData] = useState(null)
    const showToast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        console.log(data)
        setData(data)
        try {
            setIsLoading(true)
            const response = await Auth.login(data);
            console.log("response at login success -", response);
            const { access, refresh, user } = response;
            dispatch(
                setUser({
                    username: user.username,
                    accessToken: access,
                    refreshToken: refresh,
                })
            );
            setIsLoading(false)
            showToast("Login Successful", "success");
            navigate("/adminHome");
        } catch (error) {
            setIsLoading(false)
            console.log("Response error upon Login :", error);
            setError("username", {
                type: "manual",
                message:
                    error.response.data.detail || "Invalid credentials.",
            });
        }
    }
    //Loader Component
    if (isLoading) {
        return <CircleSpinner />
    };
    return (
        <div className="h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 bg-white rounded shadow-md w-96 mx-5">

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <Input
                        id="username"
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="mt-2 w-full"
                    />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="mt-2 w-full"
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full">
                    Login
                </Button>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?
                        <a href="/register" className="text-blue-500 hover:text-blue-700"> Register here</a>
                    </p>
                </div>
            </form>
        </div>
    )
}
