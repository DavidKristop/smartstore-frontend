"use client"

import { SignUpSchema } from "@/lib/validations";
import AuthForm from "@/components/forms/AuthForm";

const SignUp = () => {
    return (
        <AuthForm
            schema={SignUpSchema}
            defaultValues={{
                email: '',
                password: '',
                name: '',
                username: ''
            }}
            onSubmit={(data) => Promise.resolve({ success: true, data })}
            formType="SIGN_UP"
        />
    )
}
export default SignUp
