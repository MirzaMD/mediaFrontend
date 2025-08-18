// beige : #F0BE6F
// green : #1B4543
// blue : #B3D0C6
"use client"
import { ProfileCard } from "@/components/profile";
import { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { easeIn, motion } from "framer-motion";
import { AppFooter } from "@/components/appFooter";
type userType={
    _id:string,
    username:string,
    profile:string
    email:string
}
export default function UsersPage(){
    const [ users, setUsers ] = useState<userType[]>([]);
    const [ filteredUser, setFilteredUser ] = useState<userType[]>([]);
    const fetchingUsers = useCallback( async ()=>{
          try{
            const res = await axios.get("https://mediabackend-yj45.onrender.com/api/allUsers",
                 {withCredentials:true})
            if(res.status===200){
                setUsers(res.data);
                setFilteredUser(res.data);
            }    
          }catch(err){
            console.log(err);
          }
    },[])
    useEffect(()=>{
        fetchingUsers();
    },[fetchingUsers])

    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
         const searchedUser = (e.target.value).trim().toLowerCase();
         setFilteredUser(()=>users.filter((u)=>u.username.trim().toLowerCase().includes(searchedUser)))
    }
    return( 
    <div className={`w-full flex flex-col justify-center items-center`}>
    <motion.input 
    variants={{hid:{opacity:0, x:-50},
               show:{opacity:1,x:0,
                transition:{
                    ease:easeIn,
                    duration:1,
                    type:"spring",
                    bounce:30,
                    stiffness:50
                }
               }}}
    initial="hid"
    animate="show"           
    type="text" placeholder="enter the username"
     className={`w-[90%] rounded-md border-2 border-[#1B4543] text-[black]
        fixed top-4 z-10 text-md sm:text-lg font-bold font-serif`} 
        onChange={handleChange}/>   
   <motion.div 
   variants={{hid:{opacity:0, y:-80},
              show:{opacity:1,y:0,
                transition:{
                    duration:1,
                    type:"spring",
                    bounce:20,
                    stiffness:40
                }
              }}}
    initial="hid"
    animate="show"          
   className="w-full grid grid-cols-2 sm:grid-cols-3 place-items-center gap-4 mt-8">
        {filteredUser.map((v)=>(
            <div key={v._id}>
             <ProfileCard pic={v.profile} profileLink={`/userProfile/${v._id}`} messageLink={`/message/${v._id}`} 
             name={v.username}/>
             </div>   
        ))}
     </motion.div> 
    <div className={`h-20`}></div> 
    <AppFooter/>        
    </div>)
}