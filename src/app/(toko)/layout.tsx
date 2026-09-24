import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/db";
export const revalidate = 30;
export default async function TokoLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (<><Header /><main>{children}</main><Footer s={s} /></>);
}
