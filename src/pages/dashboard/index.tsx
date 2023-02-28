import React from "react";
import { type NextPage } from "next";

import Nav from "../../components/nav/Nav";
import { api } from "../../utils/api";
import { User } from "@prisma/client";
import { useRouter } from "next/router";


const Dashboard: NextPage = () => {

    const updateEventMutation = api.event.updateEvent.useMutation()

    function handleUpdate() {
        updateEventMutation.mutate({
            
        })
    }


    return (<>
        <Nav />
        <main className="flex min-h-screen flex-col items-center justify-center">
            Dashboard
        </main>
    
    </>)
}

export default Dashboard;