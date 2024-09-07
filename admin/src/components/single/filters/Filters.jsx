import { useState } from "react";

import { Helmet } from "react-helmet-async";
import { Category, Price } from "../../new/filters/CreateUpdateFilters";

function Filters() {
  //============
  //TOGGLE BOX
  //============
  const [openBox, setOpenBox] = useState(null);

  const toggleBox = (index) => {
    if (openBox === index) {
      setOpenBox(null);
    } else {
      setOpenBox(index);
    }
  };
  return (
    <>
      <Helmet>
        <title>Filters</title>
      </Helmet>
      <div className="product_edit filters_add_update admin_page_all page_background">
        <div className="container">
          <div className="productTitleContainer">
            <h3 className="productTitle light_shadow uppercase">
              Add and Update Filters
            </h3>
          </div>
          <span>
            <Category openBox={openBox} toggleBox={toggleBox} />
            <Price openBox={openBox} toggleBox={toggleBox} />
          </span>
        </div>
      </div>
    </>
  );
}

export default Filters;
