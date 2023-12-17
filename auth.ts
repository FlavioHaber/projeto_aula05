import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { Z } from 'zod';
import { sql } from '@vercel/postgres';
import type { Usuario } from './app/lib/domain/definicoes';
import { authConfig } from './auth.config';

async function getUsuario(email: string): Promise<Usuario | undefined> {
    try {
        const usuario = await sql<Usuario>`SELECT * FROM usuarios  WHERE email=${email}`;
        return usuario.rows[0];
    } catch (erro) {
        console.error('Erro na consulta de usuario:',erro);
        throw new Error('Erro na consulta de usuario.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = Z
                    .object({ email: Z.string().email(),senha: Z.string().min(6) })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, senha } = parsedCredentials.data;

                    const usuario = await getUsuario(email);
                    if (!usuario) return null;

                    const senhaOK = await getUsuario(email);
                    if(!usuario) return null;

                    const senhaOK = await bcrypt.compare(senha, usuario.senha);
                    if (senhaOK) return usuario;
                }
                console.log('Login inválido');
                return null;
            },
        }),
    ],
});