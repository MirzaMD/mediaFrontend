"use client"
import Image from "next/image";
import Link from "next/link";
import { FaBackward } from "react-icons/fa";
// beige : #F0BE6F
// green : #1B4543
export function MsgHead({profile,username}:{profile:string,username:string}){
    return(
        <div className={`w-full h-[150px] flex justify-between items-center
        bg-[#F0BE6F]`}>
        <Link href={"/users"}><FaBackward className={`text-3xl sm:text-6xl text-[#1B4543]`} /></Link>
        <div className={` relative h-[75px] w-[75px] sm:h-[100px] sm:w-[100px] rounded-full`}>
         <Image
           src={profile}
           alt="profile picture"
           fill
           priority
           className={`object-cover aspect-square rounded-full`}
           />
            </div>
         <h1 className={`text-[0.7rem] sm:text-lg text-[#1B4543] font-serif
            font-bold mr-4`}>{username}</h1>   
        </div>
    )
}