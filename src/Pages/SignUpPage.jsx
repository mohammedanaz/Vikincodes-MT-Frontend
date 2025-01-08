import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Auth from "../Api/Auth";
import useToast from "../Hooks/UseToast";
import { Link, useNavigate } from "react-router-dom";
import CircleSpinner from '../components/Spinners/CircleSpinner'

export default function SignUpPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm();
    const [data, setData] = useState(null)
    const showToast = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        console.log(data);
        setData(data)
        try {
            setIsLoading(true)
            const response = await Auth.signup(data);
            console.log("response at success register -", response);
            setIsLoading(false)
            showToast("User registration Successful. Please login", "success");
            navigate("/");
        } catch (error) {
            setIsLoading(false)
            console.log("Response error upon Login :", error);
            setError("username", { type: "manual", message: "" });
            setError("password", { type: "manual", message: "" });


            if (error.response && error.response.data) {
                const errorData = error.response.data;

                if (errorData.username) {
                    setError("username", {
                        type: "manual",
                        message: errorData.username[0] || "Invalid username.",
                    });
                }

                if (errorData.password) {
                    setError("password", {
                        type: "manual",
                        message: errorData.password[0] || "Invalid password.",
                    });
                }

                if (!errorData.username && !errorData.password) {
                    setError("username", {
                        type: "manual",
                        message: "Invalid credentials.",
                    });
                }
            } else {
                setError("username", {
                    type: "manual",
                    message: "Something went wrong. Please try again.",
                });
            }
        }
    };

    const password = watch('password', '');

    //Loader Component
    if (isLoading) {
        return <CircleSpinner />
    };
    return (
        <div className="h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 p-6 bg-white rounded shadow-md w-96 mx-5"
            >
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <Input
                        id="username"
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="mt-2 w-full"
                    />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="mt-2 w-full"
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword', {
                            required: 'Confirm Password is required',
                            validate: (value) => value === password || 'Passwords do not match',
                        })}
                        className="mt-2 w-full"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
                    )}
                </div>
                <Button type="submit" className="w-full">
                    Signup
                </Button>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/" className="text-blue-500 hover:text-blue-700">
                            Login here
                        </a>
                    </p>
                </div>
            </form>
        </div>
    )
}
