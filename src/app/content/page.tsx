"use client"
import { AppFooter } from "@/components/appFooter";
import { useCallback, useEffect, useState } from "react";
import { PostsCard } from "@/components/posts";
import axios from "axios";
// beige : #F0BE6F
// green : #1B4543
type TContent={
    uploaderId:string,
    uploaderName:string,
    uploaderProfile:string,
    pic:string,
    blog?:string
    createdAt:string
}
export default function ContentPage(){
    const [content, setContent ] = useState<TContent[]>([]);
    const [ arrangedContent, setArrangedContent ] = useState<TContent[]>([]);
    const fetchingContent = useCallback(async ()=>{
     try{
        const res = await axios.get("https://mediabackend-yj45.onrender.com/api/content",{
            withCredentials:true
        })
        if(res.status==200){
            setContent(res.data)
            setArrangedContent(res.data)
        }
     }catch(err){
        console.log(err)
     }
    },[])

    useEffect(()=>{
        fetchingContent();
    },[fetchingContent])
   useEffect(() => {
  const sorted = [...content].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  setArrangedContent(sorted);
}, [content]);

    return(
        <div className="w-full h-full">
            <h1 className="w-full text-center text-lg sm:text-4xl text-[#F0BE6F]
            font-serif font-extrabold mt-4"
            style={{textShadow:`3px 3px 3px #1B4543`}}>Real Media</h1>
            <div className={`w-full flex flex-col justify-center items-center gap-y-4`}>
            {arrangedContent.map((val,idx)=>(
                <div key={idx}
                className={`w-[95%]`}>
                <PostsCard profile={val.uploaderProfile} username={val.uploaderName}
                picture={val.pic} blog={val.blog || ""} profileLink={`/userProfile/${val.uploaderId}`}/>
                </div>    
            ))}
            </div>
            <div className={`h-[200px]`}></div>
            <AppFooter/>
        </div>
    )
}