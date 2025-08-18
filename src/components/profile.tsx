"use client"
import Image from "next/image";
import { FaMessage, FaUser } from "react-icons/fa6";
import Link from "next/link";
// beige : #F0BE6F
// green : #1B4543
// blue : #B3D0C6
export function ProfileCard({pic,profileLink,messageLink,name}:{pic:string,profileLink:string,messageLink:string,name:string}){
    return(
        <div className={`h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] flex mt-8
        flex-col justify-center items-center`}>
         <div className={`relative h-[120px] w-[120px] sm:h-[250px] sm:w-[250px] rounded-lg`}>
          <Image
            src={pic?pic:"/astroWorld.jpg"}
            alt="profile picture"
            fill
            priority
            className={`object-cover aspect-square rounded-lg`}
            />
         </div>
         <h1 className={`text-md sm:text-lg text-[#1B4543] font-serif font-extraligh mt-2`}>{name}</h1>
         <div className={`w-full flex justify-evenly items-center mt-2`}>
         <Link href={profileLink?`${profileLink}`:"/"}><FaUser className={`text-3xl sm:text-4xl text-[#1B4543]`}/></Link>
         <Link href={messageLink?`${messageLink}`:"/"}><FaMessage className={`text-3xl sm:text-4xl text-[#1B4543]`}/></Link>
         </div>
        </div>
    )
}