import React from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { api } from "../../utils/api";
import { isProfileComplete } from "../../pages/(utils)/funcs";

import NavProfile from "./NavProfile";


interface NavProps {

}

const Nav: React.FC<NavProps> = ({  }) => {

    const userQuery = api.account.me.useQuery();
    const router = useRouter();

    return (<>
        <div className="h-12"></div>
        <nav className="flex h-12 fixed -top-0 z-10 bg-neutral-800 text-white w-full px-10">
            <div className="flex h-full items-center text-2xl font-bold">
                HostWell
            </div>
            <div className="flex ml-auto h-full">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavProfile user={userQuery.data} />
            </div>
        </nav>
    </>)
}


interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
    const router = useRouter();
    return (<>
        <li onClick={e => router.push(href)} className="h-full flex items-center mr-6 cursor-pointer text-sm hover:text-violet-300">{children}</li>
    </>)
}


export default Nav;