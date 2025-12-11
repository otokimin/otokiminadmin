import React from "react";
import { Search } from "react-bootstrap-icons";
import "../../App.css";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
}

const UserSearchBar: React.FC<Props> = ({ search, setSearch, onAdd }) => {
  return (
    <div
      className="
        d-flex 
        flex-column 
        flex-md-row 
        justify-content-md-between 
        align-items-md-center 
        gap-3 
        mb-2
      "
    >
      <div className="input-group flex-grow-1" style={{ maxWidth: "450px" }}>
        <span className="input-group-text bg-white">
          <Search />
        </span>
        <input
          type="text"
          className="form-control user-search-input"
          placeholder="Kullanıcı ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <button
        className="btn fw-semibold user-add-btn"
        onClick={onAdd}
      >
        Kullanıcı Ekle
      </button>
    </div>
  );
};

export default UserSearchBar;
