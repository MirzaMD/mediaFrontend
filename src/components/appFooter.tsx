"use client"
import { FaMessage, FaBell } from "react-icons/fa6";
import { HiMenu } from "react-icons/hi";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
// beige : #F0BE6F
// green : #1B4543
export function AppFooter() {
  const [displayDropDown, setDisplayDropDown] = useState(false);
  const [selection, setSelection] = useState("Content");
  const route = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (path === "/users") {
      setSelection("Message");
    } 
    else if(path === "/notifications"){
      setSelection("Message");
    }
    else {
      setSelection("Content");
    }
  }, [path]);

  return (
    <div className="w-full flex justify-evenly items-center fixed bottom-1 z-[99999] pointer-events-auto">
      <div className="w-full flex justify-evenly items-center">
        {selection === "Content" ? (
          <>
            <Link href={"/content"}>
              <FaHome className="text-[#1B4543] text-3xl sm:text-6xl" />
            </Link>
            <Link href={"/profile"}>
              <FaUserCircle className="text-[#1B4543] text-3xl sm:text-6xl" />
            </Link>
          </>
        ) : (
          <>
            <Link href={"/users"}>
              <FaMessage className="text-[#1B4543] text-3xl sm:text-6xl" />
            </Link>
            <Link href={"/notifications"}>
            <FaBell className="text-[#1B4543] text-3xl sm:text-6xl" />
            </Link>
          </>
        )}

        <HiMenu
          className="text-[#1B4543] text-3xl sm:text-6xl cursor-pointer"
          aria-label="Menu"
          onClick={() => setDisplayDropDown((prev) => !prev)}
        />
      </div>

      {displayDropDown && (
        <div className="absolute bottom-20 right-20 sm:right-56 bg-[#B3D0C6] rounded shadow-lg p-2 z-[100000]">
          {["Content", "Message", "Upload", "Logout", "Deactivate"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  setSelection(item);
                  setDisplayDropDown(false);
                  if (item === "Upload") route.replace("/uploading");
                  else if(item=="Message") route.replace("/users");
                  else if(item=="Content") route.replace("/content");
                  else if(item==="Logout") route.replace("/logout");
                  else route.replace("/deactivate")
                }}
                className="block w-full text-left px-4 py-2 text-[#1B4543] hover:bg-[#e0ae5f] cursor-pointer"
              >
                {item}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

