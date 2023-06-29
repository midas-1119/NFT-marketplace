import Image from "next/image";
import { useEffect } from 'react'

interface IProps {
  src: any;
  width?: number;
  height?: number;
  className?: string;
  figClassName?: string;
  alt?: string;
  blurEffect?: boolean;
  priority?: boolean;
  layout?: any;
  objectFit?: any;
}

const ImageComponent = ({
  src,
  width,
  height,
  className,
  figClassName,
  alt,
  layout,
  objectFit,
  blurEffect,
  priority,
  ...rest
}: IProps) => {
  const myLoader = ({ src, width, quality, }: any) => {
    return `${src}}`;
  };
  // const myLoader = ({ src, width, quality }: any) => {
  //   return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
  // };
  return (
    <>
      <figure
        className={`relative leading-0 ${figClassName ? figClassName : ""}`}
      >
        <Image
          src={src}
          width={width}
          height={height}
          className={className}
          placeholder={!blurEffect ? "empty" : "blur"}
          blurDataURL={`/_next/image?url=${src}&w=16&q=1`}
          alt={alt ? alt : "Image"}
          layout={layout}
          objectFit={objectFit}
          priority={priority}
          {...rest}
        />
      </figure>
    </>
  );
};

export default ImageComponent;
