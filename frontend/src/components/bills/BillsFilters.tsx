import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { BillsFilterParams } from "../../types/bills/types";
import { RegionDropdown } from "react-country-region-selector";

const sortType = [
  { name: "All types", value: "all" },
  { name: "State Bills", value: "state bills" },
  { name: "National Bills", value: "national bills" },
];

const sortStatus = [
  { name: "All status", value: "all" },
  { name: "First Reading", value: "first reading" },
  { name: "Second Reading", value: "second reading" },
  { name: "Committee Stage", value: "committee stage" },
  { name: "Report Stage", value: "report stage" },
  { name: "Third Reading", value: "third reading" },
  { name: "Concurrence", value: "concurrence" },
  { name: "President Assent", value: "president assent" },
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

interface BillsProps {
  getFilterUrl: (filter: BillsFilterParams) => string;
}

function BillsFilters({ getFilterUrl }: BillsProps) {
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
  const [selectedState, setSelectedState] = useState<string>(
    searchParams.get("sortState") || "all"
  );
  const [selectedViewOption, setSelectedViewOption] = useState<string>(
    searchParams.get("sortOrder") || "all"
  );

  useEffect(() => {
    setSelectedType(searchParams.get("sortType") || "all");
    setSelectedStatus(searchParams.get("sortStatus") || "all");
    setSelectedCategory(searchParams.get("sortCategory") || "all");
    setSelectedState(searchParams.get("sortState") || "all");
    setSelectedViewOption(searchParams.get("sortOrder") || "all");
  }, [location.search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(getFilterUrl({ searchQuery }));
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: event.target.value,
        sortStatus: selectedStatus,
        sortCategory: selectedCategory,
        sortState: selectedState,
        sortOrder: selectedViewOption,
      })
    );
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: event.target.value,
        sortCategory: selectedCategory,
        sortState: selectedState,
        sortOrder: selectedViewOption,
      })
    );
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: selectedStatus,
        sortCategory: event.target.value,
        sortState: selectedState,
        sortOrder: selectedViewOption,
      })
    );
  };

  const handleStateChange = (val: string) => {
    setSelectedState(val); // Use the first parameter for the selected value
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: selectedStatus,
        sortCategory: selectedCategory,
        sortState: val, // Use the selected value here
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
        sortState: selectedState,
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
                  placeholder="Search for bills and issues"
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

      <div className="sort sort_bills c_flex">
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
            onChange={handleTypeChange}
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
            onChange={handleStatusChange}
          >
            {sortStatus.map((item, index) => (
              <option value={item.value} key={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort_category sort_border a_flex">
          <h4>
            {" "}
            <span className="sort_by">Sort by</span> Category:{" "}
          </h4>
          <select
            name="sortCategory"
            id="sortCategory"
            className="select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {sortCategory.map((item, index) => (
              <option value={item.value} key={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort_state a_flex">
          <h4>
            <span className="sort_by">Sort by</span> State:{" "}
          </h4>
          <RegionDropdown
            country="Nigeria"
            id="selectedState"
            name="selectedState"
            value={selectedState}
            onChange={handleStateChange}
            classes="select region_drop_down"
            defaultOptionLabel="All state"
          />
        </div>
      </div>

      <div className="bill_mobile">
        <div className="mobile">
          <div className="sort_view_options">
            <div className="view_options a_flex">
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
}

export default BillsFilters;
