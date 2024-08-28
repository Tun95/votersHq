import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { BillsFilterParams } from "../../../types/bills/types";

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

interface BillsProps {
  getFilterUrl: (filter: BillsFilterParams) => string;
}

const PostFilter: React.FC<BillsProps> = ({ getFilterUrl }) => {
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

  useEffect(() => {
    setSelectedType(searchParams.get("sortType") || "all");
    setSelectedStatus(searchParams.get("sortStatus") || "all");
    setSelectedCategory(searchParams.get("sortCategory") || "all");
  }, [location.search]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(getFilterUrl({ searchQuery }));
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: value,
        sortStatus: selectedStatus,
        sortCategory: selectedCategory,
      })
    );
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedStatus(value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: value,
        sortCategory: selectedCategory,
      })
    );
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCategory(value);
    navigate(
      getFilterUrl({
        searchQuery,
        sortType: selectedType,
        sortStatus: selectedStatus,
        sortCategory: value,
      })
    );
  };

  return (
    <>
      <div className="home_filters">
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
      <div className="sort c_flex">
        <div className="sort_type a_flex">
          <h4>
            <span className="sort_by">Sort by</span> Type:
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
        <div className="sort_status a_flex">
          <h4>
            <span className="sort_by">Sort by</span> Status:
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
        <div className="sort_category a_flex">
          <h4>
            <span className="sort_by">Sort by</span> Category:
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
      </div>
    </>
  );
};

export default PostFilter;
