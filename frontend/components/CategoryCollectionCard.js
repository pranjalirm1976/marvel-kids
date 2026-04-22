import Image from "next/image";
import Link from "next/link";

export default function CategoryCollectionCard({
  title,
  description,
  href,
  image,
  gradient,
  priority = false,
}) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[300px] overflow-hidden"
      aria-label={`${title} collection`}
    >
      <Image
        src={image}
        alt={`${title} kids collection`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h2 className="text-5xl font-black uppercase leading-none text-white sm:text-[46px]">{title}</h2>
        <p className="mt-2 max-w-[16rem] text-base font-medium leading-snug text-white/90 sm:text-[1.05rem]">
          {description}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
          <span>Explore Collection</span>
          <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}
