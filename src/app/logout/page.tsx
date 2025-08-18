"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
// beige : #F0BE6F
// green : #1B4543
export default function DeletePage(){
    const route = useRouter();
    const deleting = async () =>{
        try{
            const res = await axios.post(`https://mediabackend-yj45.onrender.com/api/logout`,{
                withCredentials:true
            })
            if (res.status==200){
               route.replace("/login")
            }
        }catch(err){
            console.log(err);
        }
    }
    return(
    <motion.div 
    variants={{hid:{opacity:0, y:30},
               show:{opacity:1,
                y:0,
                transition:{
                    type:"spring",
                    bounce:8,
                    stiffness:80
                }
               }}}
    initial="hid"
    animate="show"           
    className={`h-screen w-full flex flex-col justify-center items-center gap-y-4`}>
    <p
    className={`text-sm sm:text-lg text-[#1B4543] font-serif`}
    >Are you sure you want to logout?</p>
    <div className={`w-full flex justify-evenly items-center`}>
        <Link href={"/users"}
         className={`px-2 bg-[#F0BE6F] rounded-lg
        text-sm sm:text-lg text-[#1B4543] font-mono font-bold cursor-pointer`}
        style={{boxShadow:`3px 3px 3px #1B4543`}}>NO</Link>
        <button type="button" onClick={deleting}
        className={`px-2 bg-[#F0BE6F] rounded-lg
        text-sm sm:text-lg text-[#1B4543] font-mono font-bold cursor-pointer active:bg-[#eaab47]`}
        style={{boxShadow:`3px 3px 3px #1B4543`}}>YES</button>
    </div>
    </motion.div>)
}