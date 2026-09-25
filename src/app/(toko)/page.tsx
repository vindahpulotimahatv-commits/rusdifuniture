import { db, getSettings } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import HeroIntro from "@/components/HeroIntro";
import CategoryGrid from "@/components/CategoryGrid";
import QuickActionsBar from "@/components/QuickActionsBar";
import PromoHeroCard from "@/components/PromoHeroCard";
import PromoBannerWide from "@/components/PromoBannerWide";
import ShopSidebar from "@/components/ShopSidebar";
import BenefitsSection from "@/components/BenefitsSection";
import GallerySection from "@/components/GallerySection";
import TestimonialSection from "@/components/TestimonialSection";

export const revalidate = 30;

export default async function Home() {
  const s = await getSettings();
  const [{ data: cats }, { data: feat }, { data: banners }, { data: gallery }, { data: testi }] = await Promise.all([
    db().from("categories").select("*").eq("is_active", true).order("sort_order"),
    db().from("products").select("*").eq("is_active", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(8),
    db().from("banners").select("*").eq("type", "hero").eq("is_active", true).order("sort_order").limit(1),
    db().from("gallery").select("id,image_url,title").eq("is_active", true).order("id", { ascending: false }).limit(6),
    db().from("testimonials").select("id,name,rating,comment,photo_url").eq("is_active", true).order("created_at", { ascending: false }).limit(6),
  ]);

  const topTwo = (feat || []).slice(0, 2);
  const rest = (feat || []).slice(2, 6);
  const banner = (banners && banners[0]) || null;

  return (
    <>
      <HeroIntro num={s.whatsapp} />
      <CategoryGrid cats={(cats || []) as any} />
      <QuickActionsBar s={s} />

      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid lg:grid-cols-[1fr_1fr_320px] gap-5 items-stretch">
          {/* Kolom kiri: 2 produk unggulan + banner promo lebar */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              {topTwo.length > 0 ? topTwo.map((p: any) => <ProductCard key={p.id} p={p} />) : (
                <p className="col-span-2 text-silver text-sm text-center py-10">Belum ada produk unggulan.</p>
              )}
            </div>
            <PromoBannerWide />
          </div>

          {/* Kolom tengah: banner Desain Modern */}
          <PromoHeroCard banner={banner} />

          {/* Kolom kanan: sidebar filter */}
          <ShopSidebar cats={(cats || []).map((c: any) => ({ name: c.name, slug: c.slug }))} />
        </div>
      </section>

      {rest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-10">
          <h2 className="font-serif text-2xl md:text-3xl text-lgold text-center">Produk Unggulan Lainnya</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-8">
            {rest.map((p: any) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      <BenefitsSection num={s.whatsapp} />

      <GallerySection items={(gallery || []) as any} />
      <TestimonialSection items={(testi || []) as any} />
    </>
  );
}
