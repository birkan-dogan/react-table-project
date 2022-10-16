import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useTable } from "react-table";
import { COLUMNS } from "../helpers/columns";
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
  }, []);
  console.log(products);

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => products);

  const tableInstance = useTable({ columns, data });

  return <div>ReactTable</div>;
};

export default ReactTable;
