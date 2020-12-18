import React, { useEffect, useContext } from 'react';
import { SearchResults } from '../SearchResults/SearchResultsCard';
import 'antd/dist/antd.css';
import './search.scss';
import { Input } from 'antd';
// context imports
import { GroomersContext } from '../../../state/contexts/GroomersContext';
import { APIContext } from '../../../state/contexts/APIContext';
import { FormContext } from '../../../state/contexts/FormContext';

const { Search } = Input;

const Searching = () => {
  //context state
  const { allGroomers, filteredGroomers, setFilteredGroomers } = useContext(
    GroomersContext
  );
  const { searchValue, setSearchValue } = useContext(FormContext);
  const { getGroomers } = useContext(APIContext);

  //API Call
  useEffect(() => {
    getGroomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = event => {
    setSearchValue(event.target.value);
  };

  const onSearch = () => {
    const result = allGroomers.filter(groomer =>
      groomer.city.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredGroomers(result);
  };

  return (
    <div className="search-page-container">
      <div className="search-bar-container">
        <Search
          className="search-input"
          value={searchValue}
          onSearch={onSearch}
          onChange={handleChange}
          enterButton
          placeholder="Search by city"
          style={{ width: 500 }}
        />
      </div>
      <div className="card-container">
        {filteredGroomers.map((groomer, index) => {
          return <SearchResults key={index} groomer={groomer} />;
        })}
      </div>
    </div>
  );
};

export default Searching;
