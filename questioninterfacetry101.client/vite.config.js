import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

// Define the target for the API (from environment variables or fallback)
const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7226';

// Vite config for development and production
export default defineConfig(({ command, mode }) => {
    const isDevelopment = command === 'serve';

    // Only attempt to use certificates in development mode
    let serverConfig = {};
    if (isDevelopment) {
        // Define the folder for certificates based on environment (Windows vs Linux/macOS)
        const baseFolder = env.APPDATA !== undefined && env.APPDATA !== ''
            ? `${env.APPDATA}/ASP.NET/https`
            : `${env.HOME}/.aspnet/https`;

        // The name of the certificate (matches the project name)
        const certificateName = "questioninterfacetry101.client";
        const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
        const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

        // Generate HTTPS certificates if they don't already exist
        if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
            if (0 !== child_process.spawnSync('dotnet', [
                'dev-certs',
                'https',
                '--export-path',
                certFilePath,
                '--format',
                'Pem',
                '--no-password',
            ], { stdio: 'inherit' }).status) {
                throw new Error("Could not create certificate.");
            }
        }

        // Set server config to use HTTPS in development
        serverConfig = {
            https: {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            },
            port: 5173,
            proxy: {
                '^/pingauth': { target, secure: false },
                '^/register': { target, secure: false },
                '^/login': { target, secure: false },
                '^/logout': { target, secure: false },
            },
            hmr: {
                overlay: false, // Disables overlay error messages but keeps hot reloading
            },
        };
    } else {
        // Production server config (without HTTPS)
        serverConfig = {
            port: 5173,
            proxy: {
                '^/pingauth': { target, secure: false },
                '^/register': { target, secure: false },
                '^/login': { target, secure: false },
                '^/logout': { target, secure: false },
            }
        };
    }

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            }
        },
        server: serverConfig,
        build: {
            outDir: 'dist', // Default production output directory
            sourcemap: isDevelopment, // Source maps only in development for easier debugging
        }
    };
});
