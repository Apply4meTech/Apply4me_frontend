/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Explicitly set the root directory to avoid confusion with parent package-lock.json
  // This tells Turbopack to use the current directory as root, ignoring parent lockfiles
  turbopack: {
    root: '.',
  },
};

export default nextConfig;
