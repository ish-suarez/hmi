'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginInitialValues = {
    username: '',
    password: '',
};

export default function LoginPage() {

    // State for login form
    const [loginValues, setLoginValues] = useState(loginInitialValues);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, value } = e.target as HTMLInputElement;
        setLoginValues(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const res =await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginValues),
            });


            const data = await res.json();
            if (!res.ok) {
                setMessage(prev =>data.message);
                return;
            } else {
                setMessage(prev => data.message);
                setTimeout(() => location.reload(), 2000);
            }

        } catch (error) {
            console.log('Login Error:', error);
        } finally {
            setLoginValues(loginInitialValues);
        }

    }


    return (
        <form method="POST" onSubmit={handleSubmit} className="flex flex-col gap-4 w-64 mx-auto mt-20">
            <fieldset className="flex flex-col gap-4">
                <legend className="text-2xl font-bold mb-4">Login</legend>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginValues.username}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginValues.password}
                    onChange={handleChange}
                    required
                />
            </fieldset>
            <Button type="submit">Login</Button>
            <Button type="button" onClick={() => window.location.href = '/signup'}>Register new</Button>
            {message && <p className={`text-center ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
        </form>
    );
}