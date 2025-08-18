"use client"
import { useEffect, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { AppFooter } from "@/components/appFooter";
import { PostsCard } from "@/components/posts";
type Tuser = {
    _id:string,
    username:string,
    email:string,
    profile:string
}
type TContent={
    _id:string,
    uploaderId:string,
    uploaderName:string,
    blog?:string,
    pic:string
}
export default function UserPostPage(){
    const [ user, setUser ] = useState<Tuser|null>(null);
    const [ content, setContent ] = useState<TContent|null>(null);
    const [ userId, setUserId ] = useState<string>("");
    const { id } = useParams();
    const fetchingContent=useCallback(async ()=>{
        try{
            const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/content/${id}`,{
                  withCredentials:true
            })
            if (res.status==200){
                setContent(res.data);
                setUserId(res.data.uploaderId);
            }
        }catch(err){
            console.log(err);
        }
    },[])
    useEffect(()=>{
        fetchingContent();
    },[fetchingContent])
    useEffect(()=>{
        const fetchingUser = async () =>{
            try{
                const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/user/${userId}`,{
                    withCredentials:true
                })
                if(res.status==200)
                    setUser(res.data)
            }catch(err){
                console.log(err);
            }
        }
      fetchingUser();
    },[userId])
    return(
    <div>
   <PostsCard
  profile={user?.profile || null}
  username={user?.username || ""}
  picture={content?.pic || null}
  blog={content?.blog || ""}
  profileLink={userId ? `/userProfile/${userId}` : null}
  /> 
  <div className={`h-[200px]`}></div>
    <AppFooter/>
    </div>)
}