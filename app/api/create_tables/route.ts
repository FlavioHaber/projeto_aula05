import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET(request: Request) {
    try {
        let hashedPassword = await bcrypt.hash("capitu",10);
        let result = await sql`
            INSERT INTO usuarios (nome, email, senha)
            VALUES ('Machado de Assis','machado@abl.org.br',${hashedPassword})
            ON CONFLICT (id) DO NOTHING;
        `;
        hashedPassword = await bcrypt.hash("jabuti",10);
        result = await sql`
            INSERT INTO usuarios (nome, email, senha)
            VALUES ('Clarice Lispector','clarice@gmail.com',${hashedPassword})
            ON CONFLICT (id) DO NOTHING;
        `;
        hashedPassword = await bcrypt.hash("curupira",10);
        result = await sql`
            INSERT INTO usuarios (nome, email, senha)
            VALUES ('Rachel de Queiroz','rachel@yahoo.com.br',${hashedPassword})
            ON CONFLICT (id) DO NOTHING;
        `;
        return NextResponse.json({ result },{ status:200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}