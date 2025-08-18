"use client"
import { io, Socket } from "socket.io-client";
import { useRef, useEffect } from "react";

export const useSocket =()=>{
    const socketRef = useRef<Socket|null>(null);
    useEffect(()=>{
        const socket = io(`https://mediabackend-yj45.onrender.com`,{
            withCredentials:true
        })
        socketRef.current = socket;
        return ()=>{
            socket.disconnect();
        } 
    },[])
    return socketRef;
}