import Image from "next/image";

export function MediaViewer({
  imageURLs,
  className,
  ...props
}: {
  imageURLs: Array<string>;
  className: string;
}) {
  return (
    <div
      className={`w-full h-[22rem] relative flex ${className} rounded-md`}
      {...props}
    >
      {imageURLs.map((imageSrc, index) => (
        <div key={index} className="object-cover rounded-lg">
          <Image
            src={imageSrc}
            fill
            className="relative w-full rounded-md"
            alt={`Avatar ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
}
