import ProductListTable from '@/components/Tables/ProductListTable'
import { LogOut } from 'lucide-react'
import React from 'react'
import {useDispatch} from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import useToast from "../Hooks/UseToast";
import {Link, useNavigate} from "react-router-dom";

export default function AdminHomePage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    showToast("Successfully Logged Out", "success");
    navigate("/");
  };
  return (
    <>
      <div className='flex items-center justify-between bg-gray-400 h-10 md:h-14 mb-6 px-5'>
        <h1 className='font-bold text-xl md:text-3xl'>Product Display</h1>
        <LogOut 
        onClick={handleLogout}
        />
      </div>
      <div className='container mx-auto px-2 md:px-10'>
        <ProductListTable />
      </div>

    </>

  )
}
