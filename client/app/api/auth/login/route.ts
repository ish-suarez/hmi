"use server";

import { NextResponse } from "next/server";
import * as bctypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const { users, } = prisma;

const jwtSecret = process.env.JWT_SECRET as string;
const errorMessage = 'Invalid username or password';


export async function POST(req: Request) {
    try {
        /// Parse request body
        const { username, password } = await req.json();

        // Check if user already exists
        const user = await users.findUnique({
            where: { username, },
        })

        // If user does not exist, return unauthorized status
        if (!user) {
            return NextResponse.json({ message: errorMessage }, { status: 401 });
        }

        // Compare passwords
        const passwordMatch = await bctypt.compare(password, user.password);

        // If passwords do not match, return unauthorized status
        if (!passwordMatch) {
            return NextResponse.json({ message: errorMessage }, { status: 401 });
        }

        // Create JWT payload
        const payload = {
            userId: user.user_id,
            username: user.username,
        }

        // Create token
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '5m', algorithm: 'HS256' });

        // Set token in HttpsOnly cookie
        const cookieStore = await cookies();
        cookieStore.set('user_token', token, {
            name: 'user_token',
            httpOnly: true,
            path: '/',
            sameSite: 'none',
            maxAge: 300, // 5 minutes
            secure: true, // Set to false for development over HTTP
        });

        // Successful login
        return NextResponse.json({ message: 'Login successful' }, { status: 200 },);

    } catch (error) {
        return NextResponse.json(
            { message: error || 'Internal Server Error' },
            { status: 500 }
        );
    }
}