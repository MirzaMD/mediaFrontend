"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef} from "react";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { FaUpload } from "react-icons/fa";
import { InputField } from "@/components/inputField";
import { useRouter } from "next/navigation";
import Link from "next/link";
const schema = z.object({
    username:z.string().refine((val)=>val.trim()!=="",{
        message:"username cannot be blank"
    }),
    password:z.string().min(8,"needs to be at least 8 characters"),
    email:z.email(),
    profile:z.custom<FileList>((val)=> val instanceof FileList && val.length > 0 ,{
        message:" enter a profile picture"
    })
})
type Tdata = z.infer<typeof schema>
export default function SignUpPage(){
// beige : #F0BE6F
// green : #1B4543
// blue : #B3D0C6
const { register, handleSubmit, setValue, reset, formState:{ errors, isSubmitting } } = useForm<Tdata>({resolver:zodResolver(schema)})
const [ pic, setPic ] = useState<string>("");
const imgRef = useRef<HTMLInputElement|null>(null);
const route = useRouter();
const [ err, setErr ] = useState<string>("");
const sub = async (data:Tdata) =>{
    const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
    }
    try{
      const file = data.profile[0]
      const img64 = await convertToBase64(file);
      const payload ={
        username:data.username,
        password: data.password,
        email : data.email,
        profile : img64
      }
      const res = await axios.post("https://mediabackend-yj45.onrender.com/api/signup",
        payload,{
            withCredentials:true
        }
      )
      if(res.status==201){
        reset();
        route.replace("/login")
        setErr("");
        setPic("");
      }
    }
     catch(err:unknown){
          if( axios.isAxiosError(err) && err.response ){
             setErr(err.response.data?.message)
          }
     }
   }
    
   const spinner:Variants={
    hid:{rotate:0},
    show:{rotate:360,
        transition:{
            duration:0.85,
            ease:"linear",
            repeat:Infinity
        }
    }
   }
    return(
        <div className={`w-full flex flex-col gap-y-4 items-center `}>
           {isSubmitting?
           (<motion.div 
            variants={spinner}
            initial="hid"
            animate="show"
            className={`w-[250px] h-[250px] sm:h-[450px] sm:w-[450px]
           rounded-full border-4 border-[#1B4543] border-t-transparent absolute
           top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
           </motion.div>)
           :
           (
            <>
           <motion.h1 
           variants={{
            hid:{opacity:0,x:-40},
            show:{opacity:1,x:0,
                transition:{
                    duration:0.4,
                    type:"spring",
                    bounce:8,
                    stiffness:80
                }
            }
           }}
           initial="hid"
           animate="show"
           className={`text-lg sm:text-2xl text-[#1B4543] font-serif mt-2`}>Sign up</motion.h1>
            {err?
            (
                <h1 className={`text-sm sm:text-md text-[#1B4543] font-serif mt-8`}>{err}</h1>

            )
            :
            (null)}
         <motion.form
            onSubmit={handleSubmit(sub)}

            variants={{
            hid:{opacity:0,y:-40},
            show:{opacity:1,y:0,
                transition:{
                    duration:0.4,
                    type:"spring",
                    bounce:8,
                    stiffness:80
                }
            }
           }}
           initial="hid"
           animate="show"
            className={`w-full flex flex-col justify-center gap-y-8`}>
           <div className={`w-full flex flex-col justify-center items-center gap-y-4`}>
            <input type="file" hidden {...register("profile")}
            onChange={(e)=>{
                const files = e.target.files;
                if(files){
                    setValue("profile",files);
                    setPic(URL.createObjectURL(files[0]))
                }
            }} ref={imgRef}/>
            {pic?
            ( <div className={`relative h-[80px] w-[80px] sm:h-[200px] sm:w-[200px] rounded-lg`}>
             <Image
               src={pic}
               alt="profile picture"
               fill
               priority
               className={`object-cover aspect-square rounded-lg`}
               />
            </div>)
            :
            (<FaUpload className={`text-4xl sm:text-8xl border-2 border-dotted 
            text-white bg-[gray] border-sm `} />)}
            {errors.profile && (
                <p className={`text-md sm:text-lg font-mono font-bold`}>{`${errors.profile.message}`}</p>)}
            <button type="button" onClick={()=>imgRef.current?.click()}
            className={`p-1 text-md sm:text-lg rounded-sm text-[#1B4543] bg-[#F0BE6F]
            hover:bg-[#6ff06f] active:bg-[#57501a]`}
            style={{boxShadow:`3px 3px 3px #002c2a`}}>
                upload
            </button>
           </div>
           <div className={`w-full flex flex-col justify-center items-center gap-y-4`}>
           <InputField label="user" name="USERNAME" type="text" reg={register("username")} />
           {errors.username && (
            <p className={`text-md sm:text-lg font-mono font-bold`}>
           {`${errors.username.message}`}
           </p>)}

            <InputField label="email" name="EMAIL" type="email" reg={register("email")} />
           {errors.email && (
            <p className={`text-md sm:text-lg font-mono font-bold`}>
           {`${errors.email.message}`}
           </p>)}
 
            <InputField label="password" name="PASSWORD" type="password" reg={register("password")} />
           {errors.password && (
            <p className={`text-md sm:text-lg font-mono font-bold`}>
           {`${errors.password.message}`}
           </p>)}
           </div>

           <div className={`w-full flex justify-evenly items-center`}>
            <Link href={isSubmitting?"":"/"}
            className={`p-1 text-sm sm:text-xl rounded-sm text-[#1B4543] bg-[#F0BE6F]
            hover:bg-[#6ff06f] active:bg-[#57501a]`}
            style={{boxShadow:`3px 3px 3px #002c2a`}}>cancel</Link>
            <button type="submit" disabled={isSubmitting}
           className={`p-1 text-sm sm:text-xl rounded-sm text-[#1B4543] bg-[#F0BE6F]
            hover:bg-[#6ff06f] active:bg-[#57501a]`}
            style={{boxShadow:`3px 3px 3px #002c2a`}}>
                sign in
            </button>
           </div>
         </motion.form> 
         </>
         )
         }
        </div>
    )
}