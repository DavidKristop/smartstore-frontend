"use server";

import bcrypt from "bcrypt";
import {createAdminClient, createSessionClient} from "@/lib/appwrite";
import {appwriteConfig} from "@/lib/appwrite/config";
import {Query, ID} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {cookies} from "next/headers";
import {avatarPlaceholderUrl} from "@/constants/avatar";
import { auth, signOut } from "@/auth";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient()

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
    )

    return result.total > 0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const createAccount = async ({
    fullName,
    username,
    email,
    password
}: {
    fullName: string;
    username: string;
    email: string;
    password: string;
}) => {
    const existingUser = await getUserByEmail(email);
    const accountId = ID.unique()

    if (!existingUser) {
        const { databases } = await createAdminClient();
        const hashedPassword = await bcrypt.hash(password, 12);

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                email,
                avatar: avatarPlaceholderUrl,
                accountId,
                password_hash: hashedPassword,
                fullName,
                username,
            },
        );
    }

    return parseStringify({ accountId });
}

export const signInUser = async ({
    email,
    password
}: {
    email: string,
    password: string
}) => {
    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return parseStringify({
                accountId: null,
            })
        }

        const passwordsMatch = await bcrypt.compare(password, existingUser.password_hash);

        if (!passwordsMatch) {
            return parseStringify({
                accountId: null,
            })
        }

        const cookieStore = await cookies();

        cookieStore.set("user-session", existingUser.accountId, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production", // Only require HTTPS in production
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return parseStringify({
            accountId: existingUser.accountId
        });
    } catch(error) {
        handleError(error, "Failed to authenticate user");
    }
};

export const getCurrentUser = async () => {
    try {
        const nextAuthSession = await auth();

        if (nextAuthSession?.user?.email) {
            const existingUser = await getUserByEmail(nextAuthSession.user.email);
            if (existingUser) {
                return parseStringify(existingUser);
            }
        }

        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("user-session");

        if (sessionCookie && sessionCookie.value) {
            const accountId = sessionCookie.value;
            const { databases } = await createAdminClient();

            const user = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                [Query.equal("accountId", accountId)]
            );

            if (user.total > 0) {
                return parseStringify(user.documents[0]);
            }
        }

        return null;
    } catch (error) {
        console.error("Failed to get current user:", error);
        return null;
    }
}

export const signOutUser = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("user-session");

    await signOut({ redirectTo: "/sign-in" });
}