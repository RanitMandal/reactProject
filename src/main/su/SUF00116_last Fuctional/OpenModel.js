import React, { useState } from 'react'

function OpenModel() {
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState(moduleLovData);

    const [open, setOpen] = useState(false);
    // const [tableData, setTableData] = useState([]);

    // const handleRowClick = (rowData) => {
    //   setSelectRow(rowData);
    // };
    const showModal = () => {
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
    };

    const handleSearch = () => {
      // Filter the table data based on the search text
      const filteredData = moduleLovData.filter(
        (row) =>
          row.col1.toString().toLowerCase().includes(searchText.toLowerCase()) ||
          row.colSel.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filteredData);
    };

    // useEffect(() => {
    //   // Update the filtered data when the table data changes
    //   setFilteredData(tableData);
    // }, [tableData]);

    // useEffect(() => {
    //   // Reset the table data when the modal is closed
    //   if (!open) {
    //     setTableData(moduleLovData);
    //     setFilteredData(moduleLovData);
    //     setSearchText("");
    //   }
    // }, [open]);

    return (
      <>
        <div className="row-mb-12">
          <div className="col-md-2 d-inline">
            <i
              className="fa fa-search d=inline"
              title=""
              onClick={() => showModal()}
            ></i>
          </div>

          
          {(
            <Modal show={open} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Select Work Order</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="table-responsive">
                  
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                  <table className="table table-bordered dta-tabl">
                    <thead>
                      <tr>
                      <th>Work Order Memo No</th>
                        <th>Work Order No</th>
                        <th>Work Name</th>
                        <th>Work Order Date</th>
                        <th>Work Order Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row) => {
                        //handleTdClick(row.workName)

                        return (
                          <tr key={row.id} onClick={() => handleRowClick(row)}>
                             <td>{row.manOrderNo}</td>
                            <td>{row.orderNo}</td>
                            <td>{row.workName}</td>
                           
                            <td>{row.orderDate}</td>
                            <td> {row.orderValue} </td>
                            {/* <td className="hidden-td">
                              {row.orderValueInWords}
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {}
              </Modal.Body>
                                                                      
              <Modal.Footer>
                <button onClick={() => setOpen(false)}>Close</button>
              </Modal.Footer>
            </Modal>
          )}

          <div className="col-md-auto d-inline">
            <input
              className="form-control col-md-5 mx-2 d-inline "
              type="text"
              name="ordNo"
              placeholder={"aaa"}
              readOnly
              required
            />
            {/* <input
              className="form-control col-md-5 mx-2 d-inline"
              type="text"

              value={selectRow?.workName || ""}
              readOnly
            /> */}
          </div>
        </div>
      </>
    );
}

export default OpenModel