"use client"
import axios from "axios";
import { useSocket } from "@/hooks/useSocket";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { MsgHead } from "@/components/messageHead";
import { FaPlane } from "react-icons/fa6";
// beige : #F0BE6F
// green : #1B4543
type Tuser = {
    _id:string,
    username:string,
    email:string,
    profile:string,
}
type TChat = {
    senderId:string,
    receiverId:string,
    text:string,
    createdAt:string
}

export default function MessagePage(){
    const { id } = useParams();
    const [ toUser, setToUser ] = useState<Tuser>();
    const [ curUser, setCurUser ] = useState<Tuser>();
    const [ txt, setTxt ] = useState<string>("");
    const [ chats, setChats ] = useState<TChat[]>([]);
    const socketRef = useSocket();
    const fetchingToUserDetails = useCallback(async () => {
        try{
            const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/user/${id}`,{
                withCredentials:true
            })
            if(res.status===200)
                setToUser(res.data);
        }catch(err){
            console.log(err);
        }
    },[id])
    const fetchCurrentUser = useCallback(async () => {
          try{
            const res = await axios.get("https://mediabackend-yj45.onrender.com/api/currentUser",{
                withCredentials:true
            })
            if(res.status===200)
                setCurUser(res.data);
          }catch(err){
            console.log(err);
          }
    },[])
    useEffect(()=>{
        fetchingToUserDetails();
        fetchCurrentUser();
    },[fetchCurrentUser,fetchingToUserDetails])

   const chatroom = useMemo(() => {
  if (!toUser?._id || !curUser?._id) return "";
  return [toUser._id, curUser._id].sort().join("-");
}, [toUser, curUser]);

useEffect(() => {
  if (!chatroom) return;
  const socket = socketRef.current;
  if (!socket) return;
  socket.emit("join-room", chatroom);
}, [chatroom, socketRef]);

    useEffect(()=>{
        const fetchingChats = async ()=>{
            try{
                const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/chats/${chatroom}`,{
                    withCredentials:true
                })
                if (res.status===200)
                    setChats(res.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchingChats();
    },[chatroom])
useEffect(() => {
  const socket = socketRef.current;
  if (!socket) return;

  const handleReceive = ({ sender, receiver, msg }: 
    { sender: string; receiver: string; msg: string; }) => {
    setChats((prev) => [
      ...prev,
      {
        senderId: sender,
        receiverId: receiver,
        text: msg,  // fixed
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  socket.on("receive-message", handleReceive);

  return () => {
    socket.off("receive-message", handleReceive); // cleanup
  };
}, [chatroom, socketRef]);

const sendMsg = async () => {
  const socket = socketRef.current;
  if (socket && txt.trim() !== "" && curUser && toUser) {
    socket.emit("message-sent", {
      sender: curUser._id,
      receiver: toUser._id,
      msg: txt,
      room: chatroom,
    });
    setTxt(""); // just clear input
  }
};


    return(
        <div>
         <MsgHead profile={toUser?.profile || "/astroWorld.jpg"} username={toUser?.username || "Guest"} />
          

         <div className={`w-full flex flex-col`}>
            {chats?.map((val, idx) => (
         <h1
          key={idx}
          className={`max-w-[70%] p-2 rounded-lg text-sm sm:text-lg mb-2 m-4
          ${val.senderId === curUser?._id 
          ? "ml-auto bg-[#F0BE6F] text-[#1B4543] text-right"   // sent messages
          : "mr-auto bg-[#1B4543] text-[#F0BE6F] text-left"   // received messages
          }`}
           >
          {val.text}
        </h1>
         ))}
         </div>

         <div className={`w-full flex justify-center items-center gap-x-4 fixed bottom-1`}>
         <textarea value={txt} onChange={(e)=>setTxt(e.target.value)}
            placeholder={`say hello to ${toUser?.username || "Guest"}`}
            className={`w-[90%] rounded-lg border-2 border-[#1B4543]
            text-sm sm:text-lg`}/>
            <FaPlane onClick={sendMsg}
            className={`text-3xl sm:text-6xl bg-[#51fd51] active:bg-[gray]
            active:text-[black] text-white p-1 rounded-lg cursor-pointer`} />
         </div>
        </div>
    )
}