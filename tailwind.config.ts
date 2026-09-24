import type { Config } from "tailwindcss";
export default { content:["./src/**/*.{ts,tsx}"],
 theme:{extend:{colors:{ink:"#0B0B0B",charcoal:"#151515",gold:"#D4A72C",lgold:"#F2C75C",cream:"#F5F1E8",silver:"#C9C9C9"},
 fontFamily:{serif:["Playfair Display","serif"],sans:["Poppins","sans-serif"]}}},plugins:[]} satisfies Config;
