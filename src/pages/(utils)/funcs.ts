import { User } from "@prisma/client";


export const isProfileComplete = (user: User) => {
    return user.name && user.bio && user.avatar;
}