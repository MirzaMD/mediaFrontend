"use client"
// beige : #F0BE6F
// green : #1B4543
// blue : #B3D0C6
import { UseFormRegisterReturn } from "react-hook-form"
export function InputField({label,name,type,reg}:{label:string, name:string, type:string, reg:UseFormRegisterReturn}){
    return(
        <div className={`w-full flex flex-col justify-center items-center gap-y-4`}>
            <label htmlFor={label}
            className={`text-lg sm:text-xl font-serif
            font-light text-[#1B4543]`}>{name}</label>
            <input type={type} 
            {...reg}
            className={`w-[85%] rounded-md border-2 border-[#1B4543]
                text-md sm:text-lg text-[#1B4543]`}
            placeholder={`enter the ${name}`}   
            id={label}
            /> 
        </div>
    )
}