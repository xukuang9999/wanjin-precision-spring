import type { FC, ImgHTMLAttributes } from 'react';

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'className' | 'src' | 'srcSet'> & {
  src: string;
  imgClassName?: string;
  pictureClassName?: string;
  modernFormats?: boolean;
  responsiveWidths?: number[];
  originalWidth?: number;
};

const MODERNIZABLE_EXTENSIONS = /\.(jpe?g|png)$/i;

const replaceExtension = (src: string, extension: 'avif' | 'webp') =>
  src.replace(MODERNIZABLE_EXTENSIONS, `.${extension}`);

const buildVariantSrc = (src: string, width: number) =>
  src.replace(MODERNIZABLE_EXTENSIONS, (_, extension) => `-${width}.${extension}`);

export const ResponsiveImage: FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes,
  imgClassName,
  pictureClassName,
  modernFormats = true,
  responsiveWidths,
  originalWidth,
  ...imgProps
}) => {
  const canServeModernFormats = modernFormats && MODERNIZABLE_EXTENSIONS.test(src);
  const resolvedPictureClassName = pictureClassName ? `block ${pictureClassName}` : 'block';
  const sameFormatSrcSet =
    responsiveWidths && responsiveWidths.length > 0
      ? [
          ...responsiveWidths.map((width) => `${buildVariantSrc(src, width)} ${width}w`),
          ...(originalWidth ? [`${src} ${originalWidth}w`] : []),
        ].join(', ')
      : undefined;

  return (
    <picture className={resolvedPictureClassName}>
      {canServeModernFormats ? <source srcSet={replaceExtension(src, 'avif')} sizes={sizes} type="image/avif" /> : null}
      {canServeModernFormats ? <source srcSet={replaceExtension(src, 'webp')} sizes={sizes} type="image/webp" /> : null}
      <img {...imgProps} src={src} srcSet={sameFormatSrcSet} alt={alt} sizes={sizes} className={imgClassName} />
    </picture>
  );
};
