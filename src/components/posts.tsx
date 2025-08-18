"use client"
import Image from "next/image";
import Link from "next/link";
// beige : #F0BE6F
// green : #1B4543
export function PostsCard({
  profile,
  username,
  picture,
  blog,
  profileLink
}: {
  profile: string | null,
  username: string,
  picture: string | null,
  blog: string,
  profileLink: string | null
}) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-2 m-4">
      <div className="w-full flex items-center">
        {profile && (
          <div className="relative h-[30px] w-[30px] sm:h-[100px] sm:w-[100px] rounded-full mr-4">
            <Image
              src={(profile?profile:"/astroWorld.jpg") || "/astroWorld.jpg"}
              alt="profile picture"
              fill
              priority
              className="object-cover aspect-square rounded-full"
            />
          </div>
        )}
        {profileLink ? (
          <Link href={profileLink || ""}>
            <h1 className="text-md sm:text-lg font-serif font-light text-[#1B4543] cursor-pointer">
              {username}
            </h1>
          </Link>
        ) : (
          <h1 className="text-md sm:text-lg font-serif font-light text-[#1B4543]">
            {username}
          </h1>
        )}
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-y-8">
        {picture && (
          <div className="relative h-[250px] w-[250px] sm:h-[500px] sm:w-[500px] rounded-lg mr-4">
            <Image
              src={(picture?picture:"/astroWorld.jpg") || "/astroWorld.jpg"}
              alt="picture"
              fill
              priority
              className="object-cover aspect-square rounded-lg"
            />
          </div>
        )}
        {blog && (
          <h1 className="text-lg sm:text-xl font-serif font-light text-[#1B4543] m-2">
            {blog}
          </h1>
        )}
      </div>
    </div>
  );
}
