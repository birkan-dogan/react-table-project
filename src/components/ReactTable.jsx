import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSortBy, useTable, usePagination } from "react-table";
import { COLUMNS } from "../helpers/columns";
import "./table.css";
const ReactTable = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios("https://fakestoreapi.com/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProducts();
    setPageSize(5);
  }, []);

  // const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => [...products], [products]);
  const productsColumns = useMemo(
    () =>
      products[0]
        ? Object.keys(products[0])
            .filter((key) => key !== "rating")
            .map((key) => {
              if (key === "image") {
                return {
                  Header: key,
                  accessor: key,
                  Cell: ({ value }) => (
                    <img src={value} style={{ width: "50px" }} />
                  ),
                };
              }
              return { Header: key, accessor: key };
            })
        : [],
    [products]
  );

  const tableInstance = useTable(
    { columns: productsColumns, data },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
  } = tableInstance;
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps)}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "🔻" : "🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <td {...cell.getCellProps()} key={index}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="buttons">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </>
  );
};

export default ReactTable;
