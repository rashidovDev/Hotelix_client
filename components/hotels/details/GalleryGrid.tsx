interface GalleryGridProps {
  images: string[];
  hotelName: string;
}

export default function GalleryGrid({ images, hotelName }: GalleryGridProps) {
  const [mainImage, ...rest] = images;
  const sideImages = rest.slice(0, 4);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article className="group relative overflow-hidden rounded-2xl md:col-span-1 lg:col-span-2">
        <img
          src={mainImage}
          alt={`${hotelName} main`}
          className="h-64 w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105 sm:h-72 lg:h-[420px]"
        />
      </article>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-1 lg:col-span-2">
        {sideImages.map((image, index) => (
          <article key={image + index} className="group relative overflow-hidden rounded-2xl">
            <img
              src={image}
              alt={`${hotelName} gallery ${index + 1}`}
              className="h-40 w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105 sm:h-44 lg:h-[202px]"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
