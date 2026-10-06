import React, { useState } from "react";

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  fallbackText?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fill = false,
  priority = false,
  width,
  height,
  className = "",
  style,
  fallbackText,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Compute webp source path if it points to a local /images/ asset
  const isLocalImage = src.startsWith("/images/");
  const webpSrc = isLocalImage && !src.endsWith(".webp")
    ? src.replace(/\.(png|jpe?g)$/i, ".webp")
    : null;

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-800 text-slate-400 p-4 text-center text-xs select-none ${
          fill ? "absolute inset-0 w-full h-full" : ""
        } ${className}`}
        style={style}
      >
        <span className="font-medium text-slate-300">{fallbackText || alt || "Image unavailable"}</span>
      </div>
    );
  }

  const imageElement = (
    <picture className={fill ? "contents" : "inline-block"}>
      {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${
          fill ? "absolute inset-0 w-full h-full object-cover" : ""
        } transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        style={style}
        {...props}
      />
    </picture>
  );

  if (fill) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-slate-800/20">
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-800/30 animate-pulse" />
        )}
        {imageElement}
      </div>
    );
  }

  return imageElement;
};

export default OptimizedImage;
