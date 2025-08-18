"use client"
import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { AppFooter } from "@/components/appFooter";
import { FaEllipsisV } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
// beige : #F0BE6F
// green : #1B4543
// blue : #B3D0C6
type UserType={
    _id:string,
    profile:string,
    username:string,
    email:string,
    authType:string
}
const schema = z.object({
    profile:z.custom<FileList>((val)=> val instanceof FileList && val.length>0,{
        message:"invalid profile"
    }).optional(),
    username:z.string().optional(),
    email:z.email().optional()
})
type payloadType ={
    username?:string,
    email?:string,
    profile?:string
}
type TContent={
    _id:string,
    uploaderId:string,
    uploaderProfile:string,
    uploaderName:string,
    blog:string,
    pic:string
}
type Tschema = z.infer<typeof schema>
export default function ProfilePage(){
   const [ user, setUser ] = useState<UserType>()
   const [ pic, setPic ] = useState<string>("");
   const imgRef = useRef<HTMLInputElement|null>(null);
   const [ isEditting, setIsEditting ] = useState<boolean>(false);
   const [ content, setContent ] = useState<TContent[]>([]);
   const route=useRouter();
   const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
    const fetchAccountDetails=useCallback(async ()=>{
     try{
        const res = await axios.get("https://mediabackend-yj45.onrender.com/api/currentUser",
            {
                withCredentials:true
            }
        )
        if(res.status==200){
            setUser(res.data)
            setValue("email",res.data.email)
            setValue("username",res.data.username)
        }
     }
     catch(err){
        console.log(err)
     }
    },[])
    useEffect(()=>{
        fetchAccountDetails();
    },[fetchAccountDetails])
   useEffect(()=>{
    if (!user?._id) return;
    const fetchingContent = async () =>{
        try{
            const res = await axios.get(`http://localhost:3005/api/content/currentUser/${user?._id}`,{
                withCredentials:true
            })
            if (res.status === 200){
                setContent(res.data)
            }
        }
        catch(err){
            console.log(err)
        }
    }
    fetchingContent();
   },[user?._id])
    const { register, handleSubmit, setValue, 
    formState:{ errors, isSubmitting } } =  useForm<Tschema>({resolver:zodResolver(schema)});

    const updating = async (data:Tschema)=>{
        const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
    } 
        try{
            let base64Img = "";
            if (data.profile && data.profile.length > 0) {
            const file = data.profile[0];
            base64Img = await convertToBase64(file);
           }

           const payload:payloadType = {}
           if(data.username) payload.username=data.username
           if(data.email) payload.email=data.email
           if(base64Img) payload.profile = base64Img
           const res = await axios.patch(`https://mediabackend-yj45.onrender.com/api/user/${user?._id}`,
            payload,
            {
                withCredentials:true
            }
           )
           if(res.status === 200){
            setIsEditting(true);
            setTimeout(()=>{
                window.location.reload();
            },100)
           }
         } catch(err){
           console.log(err)
         }
    }
    return(
    <div>
     {!isEditting?
     (
     <>
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
     <button type="button" onClick={()=>setIsEditting(true)}
     className={`text-md sm:text-lg text-[#0600a5] font-mono font-light cursor-pointer
     hover:text-[green] active:text-[gray]`}>
        Edit profile
    </button>
    </div>
    <AppFooter/>
    </div>
    <div className="clear-both"></div>
    <hr className="border-t border-black my-4" />
     <div className={`w-full grid grid-cols-2 sm:grid-cols-3 place-items-center 
        place-content-center mt-4`}> 
     {content.map((val,idx)=>(
        <div key={idx}
        className={`flex flex-col justify-center items-center relative z-0`}>
        <Link href={`/userPost/${val._id}`}><div className={`relative h-[100px] w-[100px] sm:h-[200px] sm:w-[200px] rounded-lg`}>
                     <Image
                       src={val.pic}
                       alt="profile picture"
                       fill
                       priority
                       className={`object-cover aspect-square rounded-lg`}
                    />
        </div></Link>
        <div className={`w-full flex justify-between items-center mt-2`}>
        <h1 className={`text-[0.7rem] sm:text-lg font-serif font-bold text-[#1B4543]`}
        >{val.blog.length>15?`${val.blog.slice(0,15)}...`:val.blog}</h1>
       <FaEllipsisV
         className="text-sm sm:text-xl text-[#1B4543] cursor-pointer"
         onClick={() => 
            setShowOptionsId(prev => prev === val._id ? null : val._id)
           }
          />
        <div
        className={`flex flex-col justify-center items-center absolute rounded-lg`}> 
        {showOptionsId === val._id && (
    <div className="flex flex-col justify-center 
    items-start absolute bg-white shadow-md rounded-xl z-10 
    ">
        {["edit","delete"].map((v, idx) => (
            <button
                key={idx}
                className="px-4 text-sm sm:text-lg text-[#1B4543] hover:bg-green-200 w-full text-left
                bg-[#dcebff] cursor-pointer "
                onClick={() => {
                    if (v === "edit") route.replace(`/edit/${val._id}`)
                    else route.replace(`/delete/${val._id}`)
                }}
            >
                {v}
            </button>
        ))}
    </div>
)}
        </div>
        </div>
        </div>
     ))}
    </div>
    <div
        className={"h-[200px]"}></div>
     </>
    )

    :

    (<form 
      onSubmit={handleSubmit(updating)}
      >
    <div className={`w-full flex justify-between items-center`}>
     <button type="button" disabled={isSubmitting}
     onClick={()=>setIsEditting(false)}
     className={`text-md sm:text-xl font-extrabold text-[#1B4543]
     cursor-pointer ml-8`}>X</button>
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
     ):<span>&#10003;</span>}
     </button>
    </div>
    <div className={`w-full flex flex-col justify-center items-center`}>
      <input type="file" hidden ref={imgRef}
      onChange={(e)=>{
        const files = e.target.files
        if(files){
            setValue("profile",files);
            setPic(URL.createObjectURL(files[0]))
        }
      }}/>  
     <button type="button" disabled={isSubmitting}
     onClick={()=>imgRef.current?.click()}
     className={`text-md sm:text-lg text-[#0600a5] font-mono font-light cursor-pointer
     hover:text-[green] active:text-[gray]`}>
        change picture
    </button>  
    <div className={` float-left relative h-[80px] w-[80px] sm:h-[200px] sm:w-[200px] rounded-lg mr-4`}>
    <Image
      src={pic?pic:user?user.profile:"/astroWorld.jpg"}
      alt="profile picture"
      fill
      priority
      className={`object-cover aspect-square rounded-lg`}
        />
    </div>
      {errors.profile && (
        <p
        className={`text-sm sm:text-lg font-mono font-bold text-red-500`}
        >{`${errors.profile.message}`}</p>
     )} 
    </div>
    <div className={`w-full flex flex-col justify-evenly item-center`}>
    <div className={user?.authType==="local"?`w-full flex flex-col justify-center items-center gap-y-2`:`hidden`}>
    <label className={`text-[#1B4543] text-md sm:text-lg font-serif`}>USERNAME:</label>   
    <input type="text" placeholder="enter your username"
    {...register("username")}
    className={`w-[80%] rounded-md border-2 border-[#1B4543] text-sm sm:text-lg 
        text-[#1B4543]`} />
     {errors.username && (
        <p
        className={`text-sm sm:text-lg font-mono font-bold text-red-500`}
        >{`${errors.username.message}`}</p>
     )}   
    </div>
    <div className={`w-full flex flex-col justify-center items-center gap-y-2`}>
    <label className={`text-[#1B4543] text-md sm:text-lg font-serif`}>EMAIL:</label>   
    <input type="email" placeholder="enter your email"
    {...register("email")}
    className={`w-[80%] rounded-md border-2 border-[#1B4543] text-sm sm:text-lg 
        text-[#1B4543]`} />
      {errors.email && (
        <p
        className={`text-sm sm:text-lg font-mono font-bold text-red-500`}
        >{`${errors.email.message}`}</p>
     )}     
    </div>
    </div>
    </form>)}   
    </div>)
}