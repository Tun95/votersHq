import parse from "html-react-parser";

import { BillsResponse } from "../../types/bills/bills details/types";

function DetailsContent({ bill }: BillsResponse) {
  return (
    <div className="parse_details_content">
      {parse(bill?.description ?? "")}
    </div>
  );
}

export default DetailsContent;
