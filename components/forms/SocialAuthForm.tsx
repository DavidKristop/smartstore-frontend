'use client'

import {Button} from "@/components/ui/button";
import Image from "next/image";
import {toast} from "sonner";
import {signIn} from "next-auth/react";
import ROUTES from "@/constants/routes";

const SocialAuthForm = () => {
    const buttonClass = "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5"

    const handleSignIn = async(provider: "github" | "google") => {
        try {
            await signIn(provider, {
                callbackUrl: ROUTES.HOME,
            });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An error occurred during sign-in.");
            }
        }
    }

    return (
        <div className="mt-10 flex flex-wrap gap-2.5">
            <Button className={`${buttonClass} cursor-pointer`} onClick={() => handleSignIn('github')}>
                <Image
                    src="assets/icons/github.svg"
                    alt="Github Logo"
                    width={20}
                    height={20}
                    className="mr-2.5 object-contain"
                />
                <span>Log in with GitHub</span>
            </Button>
            <Button className={`${buttonClass} cursor-pointer`} onClick={() => handleSignIn('google')}>
                <Image
                    src="/assets/icons/google.svg"
                    alt="Google Logo"
                    width={20}
                    height={20}
                    className="mr-2.5 object-contain"
                />
                <span>Log in with Google</span>
            </Button>
        </div>
    )
}
export default SocialAuthForm
