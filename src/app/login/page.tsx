"use client"
import { easeIn, motion, Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FaGithub, FaDiscord } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
// beige : #F0BE6F
// green : #1B4543
// blue : #B3D0C6
export default function LoginPage(){
    const [ usernameError, setUsernameError ] = useState<string>("");
    const [ passwordError, setPasswordError ] = useState<string>("");
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const route = useRouter();
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sub = async () => {
    setSubmitting(true);
    const payload = {
        username: username,
        password: password
    };
    try {
        const res = await axios.post("https://mediabackend-yj45.onrender.com/api/login", payload, {
            withCredentials: true
        });

        if (res.status === 200) {
            // Artificial delay to show spinner (e.g., 1.5s)
       //     await sleep(3500);

            setPassword("");
            setUsername("");
            setUsernameError("");
            setPasswordError("");
            setSubmitting(false);
            route.replace("/users");
        }
    } catch (err: unknown) {
     //   await sleep(1000); // Optional delay on error too
        if (axios.isAxiosError(err) && err.response) {
            const message = err.response.data?.message;

            if (message === "user not found") {
                setUsernameError("Invalid username");
                setPasswordError("");
            } else if (message === "Invalid password.") {
                setUsernameError("");
                setPasswordError("Invalid password");
            } else {
                setUsernameError("An error occurred.");
                setPasswordError("Try again later.");
            }
        } else {
            setUsernameError("Unexpected error.");
            setPasswordError("Please try again.");
        }
        setSubmitting(false);
    }
};

    const spinner:Variants = {
        hid: { rotate:0},
        show : { opacity:1, 
                 rotate:360,
                 transition:{
                    ease:"linear",
                    duration:0.5,
                    repeat:Infinity
                 }
              }
    } 
    return(
        <div className={`flex flex-col items-center`}>
            <motion.h1
            className={`text-3xl sm:text-4xl font-serif font-light sm:text-[#1B4543]
            text-[#ffffff] absolute sm:top-10 z-20 top-6`}>
                Real Media</motion.h1>
            <motion.form 
            className={`w-[300px] sm:w-[500px] h-[300px] sm:h-[500px]
                flex flex-col justify-evenly items-center absolute
                left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                border-2 rounded-lg bg-[#1B4543] border-[#F0BE6F]`}>
                    <div className={`h-[60px]`}></div>
                <div className={`flex flex-col justify-center items-center w-full`}>
                    <label className={`text-md sm:text-lg font-serif font-bold
                        text-[#F0BE6F]`}>Username:</label>
                    <input type="text" placeholder="enter your username" value={username}
                    className={`w-[80%] rounded-xl text-md sm:text-lg text-[#F0BE6F]
                        border-2 border-[#F0BE6F]`}
                    onChange={(e)=>{setUsername(e.target.value)}}/>
                    {usernameError?
                     <p className={`text-md sm:text-lg text-red-500 font-bold`}>{usernameError}</p>
                    :
                    null}
                </div>
                <div className={`flex flex-col justify-center items-center w-full`}>
                    <label className={`text-md sm:text-lg font-serif font-bold
                        text-[#F0BE6F]`}>Password:</label>
                    <input type="password" placeholder="enter your password" value={password}
                    className={`w-[80%] rounded-xl text-md sm:text-lg text-[#F0BE6F]
                        border-2 border-[#F0BE6F]`}
                    onChange={(e)=>{setPassword(e.target.value)}}/>
                    {passwordError?
                     <p className={`text-md sm:text-lg text-red-500 font-bold`}>{passwordError}</p>
                    :
                    null}
                </div>
                <button type="button" onClick={sub}
                className={`p-1 sm:p-2 w-[80%] rounded-lg 
                text-md sm:text-lg font-mono bg-[#F0BE6F]
                text-[#1B4543] hover:bg-[gray]
                cursor-pointer flex
                items-center justify-center`}>{!submitting?"login":
                <motion.div 
                variants={spinner}
                initial="hid"
                animate="show"
                className={`w-[20px] h-[20px] rounded-full border-4 border-t-transparent
                border-[#1B4543]`}></motion.div>}</button>
                 <p
                    className={`text-md sm:text-lg text-[#ffffff46] font-serif`}>login using:</p>

                <div className={`w-full flex justify-evenly items-center`}>
                    <FaGithub className={`text-3xl sm:text-5xl text-[#3bff3b] cursor-pointer
                    hover:text-[gray] `} 
                    onClick={ ()=>{window.location.href="https://mediabackend-yj45.onrender.com/api/login/github";}}/>
                    <FaDiscord className={`text-3xl sm:text-5xl text-[#e53bff] cursor-pointer
                    hover:text-[gray] `} 
                     onClick={ ()=>{window.location.href="https://mediabackend-yj45.onrender.com/api/login/discord";}}/>
                </div>

                <div className={`w-full flex flex-col justify-center items-center`}>
                    <p className={`text-md sm:text-lg text-[#F0BE6F] font-serif`}>
                        I am new, I want to</p>
                    <Link href={"/signup"}
                    className={`text-md sm:text-lg text-[#49b3ff] font-serif
                    font-bold hover:text-[#6c89ff] cursor-pointer`}>sign up</Link>
                </div>
            </motion.form>
        </div>
    )
}