import Slider from "react-slick";
import ComingSoonSlider from "./ComingSoonSlider";
import "./styles.scss";

import slide1 from "../../../assets/home/slide1.png";
import slide2 from "../../../assets/home/slide2.png";
import { useEffect, useState } from "react";

type SlideItem = {
  name: string;
  img: string;
};

function ComingSoon() {
  const list: SlideItem[] = [
    {
      name: "slide one",
      img: slide1,
    },
    {
      name: "slide two",
      img: slide2,
    },
    {
      name: "slide three",
      img: slide1,
    },
  ];

  //=============
  // REACT SLICK
  //=============
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1250) {
        setSlidesToShow(Math.min(3, list?.length));
      } else if (screenWidth >= 800) {
        setSlidesToShow(Math.min(3, list?.length));
      } else if (screenWidth >= 450) {
        setSlidesToShow(Math.min(2, list?.length));
      } else {
        setSlidesToShow(Math.min(1, list?.length));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [list?.length]);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    arrows: false,
    autoplay: false,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    appendDots: (dots: React.ReactNode) => {
      return <ul style={{ margin: "0px" }}>{dots}</ul>;
    },
  };
  return (
    <section className="coming_soon" id="coming-soon">
      <div className="container">
        <div className="content">
          <div className="header_text p_flex">
            <div className="header">
              <h1>
                Coming soon on <span className="voters"> VotersHQ</span>
              </h1>
            </div>
          </div>
          <div className="slider">
            <Slider {...settings} className="slick_slider">
              {list?.map((item, index) => (
                <ComingSoonSlider item={item} index={index} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComingSoon;
