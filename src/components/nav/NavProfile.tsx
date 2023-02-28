import React from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { isProfileComplete } from "../../pages/(utils)/funcs";


interface NavProfileProps {
    user: User | undefined;
}


const NavProfile: React.FC<NavProfileProps> = ({ user }) => {
    const router = useRouter();

    return (<>
        {
            user && (
                <div className="flex items-center h-8 ml-6 hover:bg-neutral-900 rounded-full pl-3 pr-2 cursor-pointer my-2">
                    
                    {
                        !isProfileComplete(user) && 
                        <button className="text-xs text-yellow-600 mr-2 mt-1" onClick={() => router.push("/completeSetup")}>Complete setup</button>    
                    }
                    <p onClick={e => router.push('profile')} className="mr-2 text-sm">{user.name}</p>
                    <img onClick={e => router.push('profile')} className="h-7 rounded-full" src={user.avatar || "defaultavatar.png"} alt="Profile Picture" />
                </div>
            )
        }
        {
            !user && <button className="flex h-full items-center" onClick={() => signIn()}>Login</button>
        }
    </>)
}


export default NavProfile;