"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const signupInitialValues = {
    username: '',
    password: '',
};


export default function SignupPage() {
    const [signupValues, setSignupValues] = useState(signupInitialValues);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, value } = e.target as HTMLInputElement;
        setSignupValues(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const res = await fetch('/api/auth/sign_up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupValues),
            });

            const data = await res.json();
            if (!res.ok) {
                setMessage(prev => data.message);
                return;
            } else {
                setMessage(prev => data.message);
                setTimeout(() => location.pathname = '/login', 3000);
            }

        } catch (error) {
            console.log('Signup Error:', error);
        } finally {
            setSignupValues(signupInitialValues);
        }
    }

    return (
        <form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-4 w-64 mx-auto mt-20">
            <fieldset className="flex flex-col gap-4">
                <legend className="text-2xl font-bold mb-4">Sign Up New User</legend>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={signupValues.username}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signupValues.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" className="mt-4">Sign Up</Button>
                {message && <p className={`mt-2 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
            </fieldset>
        </form>
    );
}