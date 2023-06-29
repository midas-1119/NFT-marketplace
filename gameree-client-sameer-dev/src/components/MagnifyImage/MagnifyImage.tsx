import { useState } from "react";
import ImageComponent from "../imageComponent/ImageComponent";
import ReactDOM from "react-dom";

const portalRoot = document.createElement("div");
document.body.appendChild(portalRoot);

const MagnifyImage = ({ src, className, figClassName }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e: any) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y: y > 105 ? 105 : y });
  };

  const handleMouseEnter = () => setShowZoom(true);
  const handleMouseLeave = () => setShowZoom(false);

  return (
    <div>
      {/* <img src={src} alt="Building" className="w-full h-full object-cover rounded-2xl" /> */}
      <div
        className=" cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ImageComponent
          figClassName={`${figClassName ? figClassName : ""}`}
          src={src ?? "/assets/images/detail-page.png"}
          layout="fill"
          className={`rounded-2xl vimeo-video ${className ? className : ""}`}
        />
      </div>
      {showZoom &&
        ReactDOM.createPortal(
          <div
            className="fixed overflow-hidden border border-gray-300"
            style={{
              width: "50vw",
              height: "cal(100vh -2rem)",
              top: `1rem`,
              bottom: `1rem`,
              right: `1rem`,
              zIndex: 1000,
              backgroundImage: `url(${src})`,
              backgroundSize: "260% 260%",
              backgroundPosition: `top ${
                -position.y + 6
              }rem left ${-position.x}rem`,
              backgroundRepeat: "-moz-initial",
              // transform: "translate(-50%, -50%)",
            }}
          />,
          portalRoot
        )}
    </div>
  );
};

export default MagnifyImage;
