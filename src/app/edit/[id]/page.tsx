"use client"
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
const schema = z.object({
    blog:z.string().optional()
})
type Tschema = z.infer<typeof schema>
export default function EditBlogPage(){
    const { register, handleSubmit, setValue, reset, formState:{errors,isSubmitting}}=useForm<Tschema>(
        {resolver:zodResolver(schema)}
    )
    const route=useRouter();
    const { id } = useParams();

    const fetchingPost= useCallback(async()=>{
          try{
            const res = await axios.get(`https://mediabackend-yj45.onrender.com/api/content/${id}`,
                {
                    withCredentials:true
                }
            )
            if(res.status==200)
                setValue("blog",res.data.blog)
          }catch(err){
            console.log(err);
          }
    },[])

    useEffect(()=>{
        fetchingPost();
    },[fetchingPost])

    const updating = async(data:Tschema)=>{
        try{
            const payload={
            blog:data.blog
        }
        const res = await axios.patch(`https://mediabackend-yj45.onrender.com/api/content/edit/${id}`,
            payload,
            {
                withCredentials:true
            }
        )
        if(res.status==200){
            route.replace("/profile")
            reset();
        }
        }
        catch(err){
            console.log(err);
        }
    }
    return(
        <form onSubmit={handleSubmit(updating)}
        className={`w-full flex flex-col justify-center items-center`}>
        <div className={`w-full flex justify-between items-center`}>
         <Link href={"/profile"}
         className={`ml-4 text-md sm:text-lg font-extrabold font-serif`}>X</Link>   
        <button type="submit" disabled={isSubmitting}
      className={`text-md sm:text-xl font-extrabold text-[#1B4543]
      cursor-pointer mr-8`}>
     {isSubmitting?(
        <motion.div 
        variants={{
            hid:{rotate:0},
            show:{rotate:360,
                transition:{
                    ease:"linear",
                    repeat:Infinity,
                    duration:0.35
                }
            }
        }}
        initial="hid"
        animate="show"
        className={`border-4 border-[#1B4543] border-b-transparent
        w-[10px] h-[10px] sm:w-[20px] sm:h-[20px] rounded-full`}>
        </motion.div>
     ):<span
     className={`text-md sm:text-lg font-extrabold font-serif`}
     >&#10003;</span>}
     </button>
     </div>
     {errors.blog && <p>{errors.blog.message}</p>}
     <textarea {...register("blog")}
     placeholder="add a blog?"
     className={`text-sm sm:text-lg font-serif rounded-md w-[90%] mt-8 border-2 border-[#0a2d0a]
     h-[200px] sm:h-[500px]`}/>
        </form>
    )
}