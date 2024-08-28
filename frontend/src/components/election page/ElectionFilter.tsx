import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { FilterParams } from "../../types/election/types";

const sortType = [
  { name: "All", value: "all" },
  { name: "Presidential", value: "presidential" },
  { name: "Gubernatorial", value: "gubernatorial" },
  { name: "National Assembly", value: "national" },
  { name: "State House of Assembly", value: "state" },
  { name: "Local Government", value: "local" },
];

const sortStatus = [
  { name: "All status", value: "all" },
  { name: "First Reading", value: "first" },
  { name: "Second Reading", value: "second" },
  { name: "Committee Stage", value: "committee" },
  { name: "Report Stage", value: "report" },
  { name: "Third Reading", value: "third" },
  { name: "Concurrence", value: "concurrence" },
  { name: "President Assent", value: "president" },
  { name: "Promulgation", value: "promulgation" },
];

const sortCategory = [
  { name: "All categories", value: "all" },
  { name: "Bills", value: "bills" },
  { name: "Policies", value: "policies" },
  { name: "Issues", value: "issues" },
];

const viewOptions = [
  { name: "For you", value: "all" },
  { name: "General", value: "general" },
  { name: "Trending", value: "trending" },
];

interface ElectionFilterProps {
  getFilterUrl: (filter: FilterParams) => string;
}

const ElectionFilter: React.FC<ElectionFilterProps> = ({ getFilterUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("searchQuery") || ""
  );
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get("sortType") || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get("sortStatus") || "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("sortCategory") || "all"
  );
  const [selectedViewOption, setSelectedViewOption] = useState<string>(
    searchParams.get("sortOrder") || "all"
  );

  useEffect(() => {
    setSelectedType(searchParams.get("sortType") || "all");
    setSelectedStatus(searchParams.get("sortStatus") || "all");
    setSelectedCategory(searchParams.get("sortCategory") || "all");
    setSelectedViewOption(searchParams.get("sortOrder") || "all");
  }, [location.search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(getFilterUrl({ searchQuery }));
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: value,
        sortStatus: selectedStatus,
        sortCategory: selectedCategory,
        sortOrder: selectedViewOption,
      })
    );
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: value,
        sortCategory: selectedCategory,
        sortOrder: selectedViewOption,
      })
    );
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: selectedStatus,
        sortCategory: value,
        sortOrder: selectedViewOption,
      })
    );
  };

  const handleViewOptionChange = (value: string) => {
    setSelectedViewOption(value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: selectedStatus,
        sortCategory: selectedCategory,
        sortOrder: value,
      })
    );
  };

  return (
    <>
      <div className="home_filters bills_filter">
        <div className="search_box">
          <form className="form_box" onSubmit={handleSearchSubmit}>
            <div className="inner_form a_flex">
              <div className="form_group">
                <input
                  type="search"
                  placeholder="Search for elections"
                  value={searchQuery !== "all" ? searchQuery : ""}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="btn">
                <button className="main_btn l_flex" type="submit">
                  <SearchIcon className="icon" />
                  <p>Search</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="sort">
        <div className="sort_type window sort_border c_flex">
          {sortType.map((item, index) => (
            <button
              className={`main_btn ${
                selectedType === item.value ? "active" : ""
              }`}
              key={index}
              onClick={() => handleTypeChange(item.value)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mobile">
          <div className="sort c_flex">
            <div className="sort_type sort_border a_flex">
              <h4>
                {" "}
                <span className="sort_by">Sort by</span> Type:{" "}
              </h4>
              <select
                name="sortType"
                id="sortType"
                className="select"
                value={selectedType}
                onChange={(event) => handleTypeChange(event.target.value)}
              >
                {sortType.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sort_status sort_border a_flex">
              <h4>
                {" "}
                <span className="sort_by">Sort by</span> Status:{" "}
              </h4>
              <select
                name="sortStatus"
                id="sortStatus"
                className="select"
                value={selectedStatus}
                onChange={(event) => handleStatusChange(event.target.value)}
              >
                {sortStatus.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sort_category  a_flex">
              <h4>
                {" "}
                <span className="sort_by">Sort by</span> Category:{" "}
              </h4>
              <select
                name="sortCategory"
                id="sortCategory"
                className="select"
                value={selectedCategory}
                onChange={(event) => handleCategoryChange(event.target.value)}
              >
                {sortCategory.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="sort_view_options l_flex">
            <div className="view_options c_flex">
              {" "}
              {viewOptions.map((item, index) => (
                <button
                  className={`main_btn ${
                    selectedViewOption === item.value ? "active" : ""
                  }`}
                  key={index}
                  onClick={() => handleViewOptionChange(item.value)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectionFilter;
