
import { useEffect, useRef } from "react";

const RADIUS = 720;
const SLICE_COUNT = 12;
const ITEM_SHIFT = 80;

const SpiralGallery = (props:{imageData:string[]}) => {
  
  const el = useRef<HTMLDivElement>(null);
  const animId = useRef<number>(0);
  const img = useRef<HTMLDivElement>(null);

  let angleUnit:number, sliceIndex:number, currentAngle:number, currentY:number, mouseX:number, mouseY:number;

  useEffect(() => {

    // Reset parameters
    angleUnit = 360 / SLICE_COUNT;
    sliceIndex = 0;
    mouseX = mouseY = 0;
    currentAngle = 0;
    currentY = 800;

    const items = el.current!.children;

    for (let i = 0; i < items.length;  i++) {

      const item = items[i] as HTMLDivElement;
      const itemAngle = angleUnit * sliceIndex;
      const itemAngleRad = itemAngle * Math.PI / 180;
      const xpos = Math.sin(itemAngleRad) * RADIUS;
      const zpos = Math.cos(itemAngleRad) * RADIUS;
      item.style.transform = `translateX(${xpos}px) translateZ(${zpos}px) translateY(${-i * ITEM_SHIFT}px) rotateY(${itemAngle}deg)`;
      if (++sliceIndex == SLICE_COUNT) sliceIndex = 0;
    }

    // Detect mouse movement
    document.body.onmousemove = (e:MouseEvent) => {
      mouseX = -((e.clientX / innerWidth) - 0.5) * 2;
      mouseY = -((e.clientY / innerHeight) - 0.5) * 20;
    };

    const gallery = el.current!;

    // Rotate and animate the gallery
    cancelAnimationFrame(animId.current);
    const updateFrame = () => {

      currentAngle += mouseX;
      currentY += mouseY;
      gallery.style.transform = `translateZ(-1500px) translateY(${currentY}px) rotateY(${currentAngle}deg)`;
      animId.current = requestAnimationFrame(updateFrame);
    }
    updateFrame();

  }, [props.imageData]);

  // Display the image
  const pickImage = (imgUrl:string) => {
    img.current!.style.backgroundImage = `url(${imgUrl})`;
    img.current!.style.transform = 'scale(1, 1)';
  }
  
  return (
    <div className="container my-4">
      <div className="spiral-gallery" ref={el}>
        {props.imageData.map((it, index) => 
          <div 
              onClick={() => pickImage(it)}
              key={index} 
              style={{backgroundImage:`url(${it})`}}
              className='spiral-gallery-item'>
          </div>)
        }
      </div>
      <div 
          onClick={() => {img.current!.style.transform = 'scale(0.0, 0.0)'}}
          className='image-display' 
          ref={img}>
      </div>
    </div>
  )
}

export default SpiralGallery;
