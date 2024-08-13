import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate,useLocation, Link  } from 'react-router-dom';
import { useAlert } from 'react-alert'

import Select from "react-select";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Visibility, Print  } from "@mui/icons-material";
import UploadBill from "./VMF00004_02";
import BillPrint from "./VMF00004_03";
import { getApiToken, getScplAdContext } from "../../common/common"

//import { data, states } from './makeData';
//import { MultiColumnComboBox } from "@progress/kendo-react-dropdowns";

/* API:https://64955ddeb08e17c91791fdf1.mockapi.io/api/v1/developer */
import FavLink from "../../common/FavLink";
import { Row } from "react-bootstrap";
import MsgAlert from "../../common/MsgAlert";
const headers = { Authorization: 'Bearer ' + getApiToken() };

var selectedDivValueStr = "";
var selectedVenCodeStr = "";
 
const BillList  = () => {
  let navigate = useNavigate();
  const [msg, setMsg] = useState("")
  const [msgTyp, setMsgTyp] = useState("")
  const [errExp, set_errExp] = useState({
    status: true,
    content: ""
})
  const [openData, setOpenData] = useState([]);
    useEffect(() => {

        const fetchOpenData = async () => {
            let obj =
            {
                apiId: "VMA00030"
            }

            await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/VMF00004/openForm', obj, { headers }).then((res) => {
                console.log(res.data);
                setOpenData(res.data);
                console.log(openData);
                setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                    res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
                setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
                set_errExp({status:res.data?.appMsgList?.errorStatus})
            })
        }

        fetchOpenData()

    }, [])







  const alert = useAlert()

  const [tableData, setTableData] = useState([]);
  const [render, setRender] = useState(0);

  const decodeFullForm = (shortForm)=>{
    if (shortForm==='Y') return "Yes";
    if (shortForm==='N') return "No";
    return  shortForm;  
}

const fetchTableData = async ()=>{
      
  await axios.get(process.env.REACT_APP_API_URL_PREFIX +'/BillController/GetAllRegNoBills?regNo=' +localStorage.getItem("registrationNo")).then((res)=>{
    console.log(res.data); 
    setTableData(res.data.content.map(item=>{
      return{
        ...item, 
        submitedFlagTxt: decodeFullForm(item.submitedFlag)
      }
    }));  
  })
}
  useEffect(() => {
    fetchTableData()
  }, [render])

  

//Select Division & Vendor

const [selectedDivValue, setSelectedDivValue] = useState("");
const [venName, setVenName] = useState();


const handleSelectChange = (selectedOption) => {
  setSelectedDivValue(selectedOption);
  selectedDivValueStr = `${selectedOption ? selectedOption.value : "None"}`;
  //setSelectRow(null);
  setVenCode([]);
  setSelectedVenCodeValue(null);
  setVenName("");
};

const [selectedVenCodeValue, setSelectedVenCodeValue] = useState("");

const handleVenSelectChange = (selectedOption) => {
  console.log("48, handleVenSelectChange ",selectedOption.name);
  setVenName(selectedOption.name);
  setSelectedVenCodeValue(selectedOption);
  selectedVenCodeStr = `${selectedOption ? selectedOption.value : "None"}`;
  //setSelectRow(null);
};


//Select Division
const [divOptions, setDivOptions] = useState([""]);

useEffect(() => { 
  const getDivData = async () => {
    const arr = [];
    await axios
      .get(
        process.env.REACT_APP_API_URL_PREFIX +
          "/DivisionController/GetTaggedDivisionList?regNo="+localStorage.getItem("registrationNo") 
      )
      .then((res) => {
        console.log(res.data.content);
        let result = res.data.content;
        result.map((item) => {
          return arr.push({ value: item.divCd, label: item.divName });
        });
        setDivOptions(arr);
      });
  };
  getDivData();
}, []);



//Select Vendor Code

const [venCode, setVenCode] = useState([""]);

useEffect(() => {
  const getVenCodeData = async () => {
    const arr = [];
    await axios
      .get(
        process.env.REACT_APP_API_URL_PREFIX +
          `/VendorController/GetTaggedVendorList?divCd=${selectedDivValueStr}&regNo=`+localStorage.getItem("registrationNo")  
      )
      .then((res) => {
        //await axios.get(process.env.REACT_APP_API_URL_PREFIX+"/VendorController/GetTaggedVendorList?divCd=000161&regNo=4"/* +localStorage.getItem("registrationNo") */).then((res) => {
        console.log(res.data.content);
        const result = res.data.content;
        result.map((item) => {
         
          return arr.push({ value: item.vendCd, label: item.vendName , name: item.vendName});
        });
    
        setVenCode(arr);
      });
  };
  getVenCodeData();
}, [selectedDivValue]);




  const {values, setValues} = useState();
  const [createModalOpen, setCreateModalOpen] = useState({
    open: false,
    mode: 0,
    rowId: -1,
    row: null,
    rowData: null
});
 
 
 
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    //tableData.push(values);
   // setTableData([...tableData]);
    
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };



  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "iBillNo",
        header: "IPBill No",
        size: 140,
       
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "vendBillDt",
        header: "Agency Reference Date",
        size: 140,
       
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "divName",
        header: "Division",
        size: 12,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "manOrdNo",
        header: "Work Order No.",
        size: 12,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "vendBillVal",
        header: "Amount (₹)",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "submitedFlagTxt",
        header: "Submitted",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "submitedDate",
        header: "Date of Submission",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      
    ],
    [getCommonEditTextFieldProps]
  );

  //1st
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  //csv files
  const csvExporter = new ExportToCsv(csvOptions);

  //functions
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(tableData);
  };


const [queryInputObj, setQueryInputObj] = useState({
  apiId: "VMA00025",
  criteria: {
      regNo: '',
  }

})
const handleQueryInputChange = (event) => {
  setQueryInputObj({
      apiId: "VMA00025",
      criteria: {
          ...queryInputObj.criteria,
          [event.target.name]: event.target.value
      }
  });
};
  const postQuery = async (e) => {
    e.preventDefault()

    await axios.post(process.env.REACT_APP_API_URL_PREFIX + '/VMF00004/getListPageData', queryInputObj, { headers }).then((res) => {

        if (res.data?.content?.qryRsltSet?.length) {
            setTableData(res.data?.content?.qryRsltSet)

        }
        else {
            setTableData([])
        }

        setMsg(
            res.data?.appMsgList?.list[0]?.errDesc
                ? res.data?.appMsgList?.list[0]?.errDesc +
                ' (' +
                res.data?.appMsgList?.list[0]?.errCd +
                ')'
                : ''
        );

        setMsgTyp(res?.data?.appMsgList?.list[0]?.errType);
        set_errExp({ status: res.data?.appMsgList?.errorStatus })
    }).catch(error => {
        console.log(error);
    })
}
const resetForm = () => {

  setQueryInputObj({
      apiId: "VMA00025",
      criteria: {
          regNo: '',

      }
  });
  setMsg("");
  setMsgTyp("");
  setTableData([]);
  const Form = document.getElementById('myForm')
  Form.reset();


};

  return (
    <>

<div className="page-header">
  <div>
    <h1 className="page-title">Proforma Bill List</h1>
    <nav aria-label="breadcrumb" className="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item breadcrumb-item">
          <a href="#" role="button" tabIndex={0}>
            Home
          </a>
        </li>
        <li className="breadcrumb-item breadcrumb-item active breadcrumds">
          <a href="#" role="button" tabIndex={0}>
          Proforma Bill List
          </a>
        </li>
      </ol>
    </nav>
  </div>
  <div className="ms-auto pageheader-btn">
  <a
                 className="btn btn-success btn-icon text-white"
                 onClick={() => setCreateModalOpen({
                  open: true,
                  mode: 1,
                  rowData: null
              })}
                 variant="contained"
               >
                 <span>
                   <i className="fe fe-plus" />
                   &nbsp;
                 </span>
                 Upload Proforma Bill
               </a>
  
  </div>
</div>
{msg &&  <MsgAlert errExp={errExp} msg={msg} msgTyp={msgTyp} /> }

<Row>
                    <div className="card">
                        <div className="container-fluid mb-5">
                            <form onSubmit={postQuery} id="myForm" className="py-4">
                                <div className="row mb-2 mx-2 ">
                                    <label
                                        htmlFor="exampleFormControlSelect1"
                                        className="col-sm-3 col-form-label"
                                    >
                                        <b>Registration No.: </b>
                                        {/* <span className="text-red">*</span></b> */}
                                        {/* <span className="text-red">*</span> */}
                                    </label>
                                    <div className="col-sm-4 mb-2">
                                        <input value={queryInputObj?.criteria?.regNo} name="regNo" onChange={handleQueryInputChange} className="form-control" type="text" id="exampleFormControlSelect1" placeholder="" />

                                    </div>

                                    <div className="col-sm-4">

                                        <button className="btn btn-primary" type="submit">
                                            Query
                                        </button>

                                        <button
                                            className="btn btn-secondary mx-2"
                                            type="reset"
                                            onClick={(e) => resetForm()}
                                        >
                                            Reset
                                        </button>



                                    </div>
                                </div>
                            </form>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableRowSelection
        enableColumnOrdering
        enableEditing
        positionToolbarAlertBanner="bottom"
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton disabled={tableData[row.index].submitedFlag==="Y"} color="success" /* onClick={() => table.setEditingRow(row)} */ onClick={() => setCreateModalOpen({
                open: true,
                mode: 2,
                rowData:tableData[row.index],
                index: row.index
                //rowData:[1,2,3]
              })}>
                <Edit />
              </IconButton>
            </Tooltip>
             <Tooltip arrow placement="right" title="Delete">
              <IconButton disabled={tableData[row.index].submitedFlag==="Y"} color="error" onClick={() => setCreateModalOpen({
                open: true,
                mode: 3,
                rowData:tableData[row.index],
                index: row.index
              })}>
                <Delete />
              </IconButton>
            </Tooltip> 
            <Tooltip arrow placement="right" title="View">
              <IconButton color="primary" onClick={() => setCreateModalOpen({
                open: true,
                mode: 4, 
                rowData:tableData[row.index]
              })}>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Print">
              <IconButton color="primary" 
              
              onClick= {() => navigate(`${process.env.PUBLIC_URL}/BillPrint`, {state:tableData[row.index]} )}
              >
                <Print />
              </IconButton>
            </Tooltip>
           


            <Tooltip arrow placement="left" title="Submit">
              <Button disabled={tableData[row.index].submitedFlag==="Y"} color="success"  onClick={async (e) => {
    e.preventDefault();
   
    if (
      window.confirm(
        "Are you sure? After submission you cannot edit the application!"
      )
    )
      await axios
        .put(
          process.env.REACT_APP_API_URL_PREFIX +
          "/BillController/SubmitBillInfo?iBillNo=" +
          tableData[row.index].iBillNo
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.code === 0) {
            //set_saveFlag(true)
            
            fetchTableData();
            alert.show("Bill Submitted Successfully");
          //   onClose();
          //  navigate(`${process.env.PUBLIC_URL}/BillList`);
            
          } else {
            alert(res.data.msg);
          }
        })
        .catch((error) => {
          console.log("error");
        });
  }}>
                Submit
              </Button>
            </Tooltip>


          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <>
            
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                p: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              
                 
              

              <Button
                className="btn btn-primary"
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export All Data
              </Button>
              <Button
                className="btn btn-primary"
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() =>
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export All Rows
              </Button>
              <Button
                className="btn btn-primary"
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handleExportRows(table.getRowModel().rows)}
                startIcon={<FileDownloadIcon />}
                variant="contained"
              >
                Export Page Rows
              </Button>
              <Button
                className="btn btn-primary"
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                //only export selected rows
                onClick={() =>
                  handleExportRows(table.getSelectedRowModel().rows)
                }
                startIcon={<FileDownloadIcon/>}
                variant="contained"
              >
                Export Selected Rows
              </Button>
            </Box>
          </>
        )}
      />
      </div>
      </div>
      </Row>
      <CreateModal 
        columns={columns}
        open={createModalOpen.open}
        onClose={() => setCreateModalOpen({
          open: false,
          mode: 0,
          rowId: -1,
          rowData:null
        })}
        fetchTableData={fetchTableData}
        render={render}
        setRender={setRender}
        onSubmit={handleCreateNewRow}
        mode={createModalOpen.mode}
        rowId={createModalOpen.rowId}
        data={tableData}
        setData={setTableData}
        rowData={createModalOpen.rowData} 
      />
    </>
  );
};



//example of creating a mui dialog modal for creating new rows
export const CreateModal = ({ open, columns, onClose, onSubmit, mode, rowId, setData, data, rowData, index, fetchTableData}) => {
  const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
    const [errExp, set_errExp] = useState({
        status: true,
        content: ""
    })
    const [addVal, setAddVal] = useState([])
    const [edtVal, setEdtVal] = useState([])
    const call_pageOpen_api = async (url, body, headers) => {
        await axios.post(url, body, { headers }).then(res => {
            setEdtVal(res.data.content.mst)
            setMsg(res?.data?.appMsgList?.list[0]?.errDesc)
            setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
            set_errExp({status:res.data?.appMsgList?.errorStatus})


        }).catch(error => {
            console.log(error);
        })
    }


    useEffect(() => {
        let url = "";
        let body = {}

        if (mode === 1) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/VMF00004/openAddForm";
            body = {
              apiId: "VMA00027",
          }
        }
        if (mode === 2) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/VMF00004/openEditForm";
            body = {
                apiId: "VMA00029",
                mst: {
                  ibillNo: rowData.ibillNo
                }
            }
        }
        if (mode === 3) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/VMF00004/openDeleteForm";
            body = {
                apiId: "VMA00028",
                mst: {
                  ibillNo: rowData.ibillNo
                }
            }
        }
        if (mode === 4) {
            url = process.env.REACT_APP_API_URL_PREFIX + "/VMF00004/openViewForm";
            body = {
                apiId: "VMA00031",
                mst: {
                  ibillNo: rowData.ibillNo
                }
            }


        }

         open && call_pageOpen_api(url, body, headers) 
    }, [mode])

  return (
   

<Dialog fullWidth maxWidth="xl" open={open} setData={setData} data={data}>

           
          
{/* <DialogTitle textAlign="center">Add New</DialogTitle> */}
<DialogContent>

{mode!==5 &&  <UploadBill mode={mode} setData={setData} data={data} rowData={rowData} index={index} fetchTableData={fetchTableData} onClose={onClose} />}
   {/* {mode===5 && <BillPrint mode={mode} setData={setData} data={data} rowData={rowData} index={index} onClose={onClose} />} */}
   
</DialogContent>
<DialogActions sx={{ p: "1.25rem" }}>
  <Button className="btn-on-print" onClick={onClose}>Close</Button>
  
</DialogActions>

</Dialog>



  );
};

export default BillList;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;


