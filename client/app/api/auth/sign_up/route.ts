import { NextResponse } from 'next/server';
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../../../generated/prisma/client";

// const prisma = new PrismaClient({ accelerateUrl: `${process.env.DATABASE_URL!}` }).$extends(withAccelerate());
import * as bcrypt from 'bcrypt';

const { users, } = prisma;
const saltConfig = process.env.SALT_ROUNDS;

export async function POST(req: Request) {
    try {
        // Parse request body
        const { username, password } = await req.json();

        // Check if user already exists
        const userExists = await users.findUnique({
            where: { username: username }
        });

        // // Check if user already exists and return conflict status
        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        } 
        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltConfig ? parseInt(saltConfig) : 10);

        // Create new user
        const newUser = await users.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        
        return NextResponse.json({ message: 'User created successfully', userId: newUser.user_id }, { status: 201 });

    } catch (error: { message?: string } | unknown) {
        return NextResponse.json(
            { message: error || 'Internal Server Error' },
            { status: 500 }
        );
    }

}
