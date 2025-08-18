"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { AppFooter } from "@/components/appFooter";
type TChat ={
    _id:string,
    senderId:string,
    receiverId:string,
    text:string,
    createdAt:string
}
export default function NotificationPage(){
    const [ notis, setNotis ] = useState<TChat[]>([]);
    const [ userId, setUserId ] = useState<string>("");
    const fetchCurrentUser= useCallback(async ()=>{
         try{
            const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/currentUser`,{
                withCredentials:true
            })
            if(res.status===200)
                setUserId(res.data._id);
         }catch(err){
            console.log(err)
         }
    },[])
    useEffect(()=>{
        fetchCurrentUser();
    },[fetchCurrentUser,userId])
    const fetchingMessages = useCallback(async ()=>{
     try{
        const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/notifications/${userId}`,{
            withCredentials:true
        })
        if(res.status===200)
            setNotis(res.data);
     }catch(err){
        console.log(err);
     }
    },[userId])
    useEffect(()=>{
        fetchingMessages();
    },[fetchingMessages])
// beige : #F0BE6F
// green : #1B4543
    return(
        <div className={`w-full flex flex-col justify-center items-center gap-y-4`}>
        {notis?.sort((a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((val,idx)=>( 
            <div key={idx}
             className={`w-[90%] rounded-md bg-[#F0BE6F]
             flex justify-between items-center mt-4`}>
           <Link href={`/message/${val.senderId}`}><p className={`text-sm sm:text-lg text-[#1B4543]
                font-serif font-bold m-2`}>you received a text</p></Link>
            <p className={`text-[0.7rem] sm:text-sm text-[#1B4543]
                font-mono font-light m-2`}>
                {formatDistanceToNow(new Date(val.createdAt), { addSuffix: true })}    
                </p>  
            </div>    
        ))}
        <AppFooter/>
        </div>
    )
}