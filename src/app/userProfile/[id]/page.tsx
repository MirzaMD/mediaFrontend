"use client"
import { useEffect, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { AppFooter } from "@/components/appFooter";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
type TUser={
    _id:string,
    username:string,
    email:string,
    profile:string
}
type TContent={
    _id:string,
    uploaderId:string,
    uploaderName:string,
    uploaderProfile:string,
    blog?:string
    pic:string
}
export default function UserProfilePage(){
    const [ user, setUser ] = useState<TUser|null>(null);
    const [ content, setContent ] = useState<TContent[]>([]);
    const { id } = useParams();

    const fetchingUser=useCallback(async ()=>{
        try{
          const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/user/${id}`,{
            withCredentials:true
          })
          console.log(res.data)
          if(res.status===200)
            setUser(res.data)
        }catch(err){
            console.log(err);
        }
    },[])

    const fetchingContent=useCallback(async ()=>{
        try{
          const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/content/currentUser/${id}`,{
            withCredentials:true
          })
          console.log(res.data)
          if(res.status===200)
            setContent(res.data)
        }catch(err){
            console.log(err);
        }
    },[])

    useEffect(()=>{
        fetchingContent();
        fetchingUser();
    },[fetchingContent,fetchingUser])
    return(
    <div>
    <div className={`w-[90%] m-4`}>    
        <div className={` float-left relative h-[80px] w-[80px] sm:h-[200px] sm:w-[200px] rounded-lg mr-4`}>
                     <Image
                       src={user?user.profile:"/astroWorld.jpg"}
                       alt="profile picture"
                       fill
                       priority
                       className={`object-cover aspect-square rounded-lg`}
                       />
        </div>
        <div className={` w-fit flex flex-col justify-center items-center gap-y-4 cursor-pointer`}>
        <h1
        className={`text-[0.8rem] sm:text-lg text-[#1B4543] font-serif font-light`}
        >Username: {user?user.username:"Guest"}</h1>
        <a href={`mailto:${user?user.email:""}`}><h1 className={`text-[0.5rem] sm:text-lg text-[#1B4543] font-serif font-extrabold`}>
            Email: {user?user.email:"demoEmail@gamil.com"}
        </h1></a>
        </div>
        <AppFooter/>
        </div>
        <div className="clear-both"></div>
        <hr className="border-t border-black my-4" />
        <div className = {content?`w-full grid grid-cols-2 sm:grid-cols-3 place-items-center text-center`:"hidden"}>
            {content?.map((val,idx)=>(
                <div key={idx}>
                    <Link href={`/userPost/${val._id}`}><div className={`relative h-[100px] w-[100px] sm:h-[200px] sm:w-[200px] rounded-lg`}>
                    <Image
                     src={val.pic}
                     alt="profile picture"
                     fill
                     priority
                     className={`object-cover aspect-square rounded-lg`}
                    />
                    </div></Link>
                    <h1 className={`text-[0.7rem] sm:text-lg font-serif font-bold text-[#1B4543]`}
                    >{val.blog && val.blog.length>15?`${val.blog.slice(0,15)}...`:val.blog}</h1>
                </div>    
            ))}
       </div>
    </div>)
}