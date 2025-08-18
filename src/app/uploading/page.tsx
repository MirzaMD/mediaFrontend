"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useCallback, useState, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blob } from "stream/consumers";
import { AppFooter } from "@/components/appFooter";
// beige : #F0BE6F
// green : #1B4543
const schema = z.object({
    uploaderId:z.string(),
    pic:z.custom<FileList>((val)=>val instanceof FileList && val.length>0,{
        message:"upload a valid picture"
    }),
    blog:z.string().optional(),
    uploaderName:z.string(),
    uploaderProfile:z.string()
})
type Tupload = z.infer<typeof schema>

export default function UploadingPage(){
    const { register, setValue, reset, handleSubmit,
        formState:{ errors, isSubmitting }
    } = useForm<Tupload>({resolver:zodResolver(schema)})
    const imgRef = useRef<HTMLInputElement|null>(null);
    const [ photo, setPhoto ] = useState<string>("")
    const route = useRouter();
    const fetchingTheLoggedInUser = useCallback(async ()=>{
          try{
            const res = await axios.get("https://mediabackend-yj45.onrender.com/api/currentUser",{
                withCredentials:true
            })
            if(res.status == 200){
                const { _id, username, profile } = res.data
                console.log(_id,username, profile)
                setValue("uploaderId",_id);
                setValue("uploaderName",username);
                setValue("uploaderProfile",profile);
            }else{
               route.replace("/login");
            }
          }catch(err){
            console.log(err)
          }
    },[setValue, route])
    useEffect(()=>{
        fetchingTheLoggedInUser();
    },[fetchingTheLoggedInUser])

    const sub = async ( data:Tupload) =>{
    const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
    } 
    try{
        console.log("clicked")
        const file = data.pic[0]
        const base64Img = await convertToBase64(file);
        const payload ={ 
            pic:base64Img,
            blog:data.blog || "",
            uploaderId:data.uploaderId,
            uploaderName:data.uploaderName,
            uploaderProfile:data.uploaderProfile
        }
        const res = await axios.post("https://mediabackend-yj45.onrender.com/api/content/upload",
            payload,
            {
                withCredentials:true
            }
        )
        if(res.status == 201 ){
            reset();
            setPhoto("");
        }
    }catch(err){
        console.log(err);
    }
    }
    return(
        <form 
        onSubmit={handleSubmit(sub)}
        className={`w-full h-[80vh] flex flex-col items-center justify-center gap-y-8`}>
            <input type='file' hidden {...register("pic")} 
            onChange={(e)=>{
                const files = e.target.files
                if(files){
                    setValue("pic",files)
                    setPhoto(URL.createObjectURL(files[0]))
                }
            }}
            ref={imgRef}/>
         {photo?
         (
            <div className={`relative h-[80px] w-[80px] sm:h-[200px] sm:w-[200px] rounded-lg`}>
                     <Image
                       src={photo}
                       alt="profile picture"
                       fill
                       priority
                       className={`object-cover aspect-square rounded-lg`}
                       />
            </div>
         )
         :
         (
        <FaUpload 
        onClick={()=>imgRef.current?.click()}
        className={`text-6xl sm:text-9xl text-[#F0BE6F] 
            border-[#F0BE6F] border-dotted hover:text-green-700 hover:border-[whitesmoke]
            cursor-pointer border-4`}/>
         )}
         {errors.pic && (
            <p className={`mt-4 text-md text-lg font-mono font-bold
                text-red-500`}>{`${errors.pic.message}`}</p>
         )}
         <textarea {...register("blog")}
         className={`text-md sm:text-lg w-[90%] rounded-lg 
            border-2 border-[#1B4543] text-[#1B4543]`}
            placeholder="enter the blog (optional)"
        />
        <div className={`w-full flex justify-center items-center mt-4`}>
            {isSubmitting?
            ( <motion.div
            variants={{
                hid:{rotate:0},
                show:{
                    rotate:360,
                    transition:{
                        ease:"linear",
                        repeat:Infinity
                }}
            }}
            initial="hid"
            animate="show"
            className={`w-[30px] h-[30px] sm:w-[80px] sm:h-[80px] border-4 border-[#1B4543]
            border-b-transparent rounded-full `}>
            </motion.div>)
             :
             (
             <div className={`w-full flex justify-evenly items-center`}>
             <Link href={isSubmitting?"":"/users"} aria-disabled={isSubmitting}
            className={`p-1 rounded-xl text-md sm:text-lg bg-[#F0BE6F]
                text-[#1B4543] cursor-pointer hover:bg-green-700 hover:text-[whitesmoke]`}
            style={{boxShadow:`3px 3px 3px #1B4543`}}>cancel</Link>
            <button
            type="submit" disabled={isSubmitting} 
            className={`p-1 rounded-xl text-md sm:text-lg bg-[#F0BE6F]
            text-[#1B4543] cursor-pointer hover:bg-green-700 hover:text-[whitesmoke]`}
            style={{boxShadow:`3px 3px 3px #1B4543`}}>
             upload
            </button>
            </div>)}
        </div>
        <AppFooter/>
        </form>
    )
}
