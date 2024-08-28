import { FC } from "react";

type SlideItem = {
  name: string;
  img: string;
};

interface ComingSoonSliderProps {
  item: SlideItem;
  index: number;
}

const ComingSoonSlider: FC<ComingSoonSliderProps> = ({ item, index }) => {
  return (
    <div>
      <div className="slider_content">
        <div className="slide_list">
          <div className="list" key={index}>
            <div className="img">
              <img src={item.img} alt={item.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonSlider;
