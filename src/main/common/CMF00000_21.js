import { useState, useMemo,useEffect} from "react";
import { Breadcrumb,} from "react-bootstrap";
// import common, { setScplAdContext } from "./common"
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment/moment";
import axios from 'axios';
import { getApiToken } from "./common";
import { getScplAdContext } from "./common"
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { MaterialReactTable } from "material-react-table";
import { Download, Edit, Visibility} from "@mui/icons-material";
import { Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Box,
  Button,
  IconButton,
  // MenuItem,
 
  
} from "@mui/material";

export default function CommonModuleDocument() {
  const navigate = useNavigate()
  // const location = useLocation();
  // const modItem = location.state;
  // //   const modId = modItem.modId
  // const outletObj = useOutletContext()
  // //   outletObj.set_sidebarModId(modId)
  // //   sessionStorage.setItem("modId", modItem.modId);
  // const userId = getScplAdContext().userId;
  const ModId = sessionStorage.getItem("modId");
  // console.log(modItem);
  // console.log(userId);

 

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns?.map((c) => c.header),
  };
  
  const handleExportData = () => {
    csvExporter.generateCsv(tableData);
  };

  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [render, setRender] = useState(0);
  const handleCreateNewRow = (values) => {
      tableData.push(values);
      setTableData([...tableData]);
  };
  const headers = { Authorization: 'Bearer ' + getApiToken() };
  const [openData, setOpenData ]= useState([]);
 
  useEffect(()=>{
      const fetchOpenData = async ()=>{
        let obj={
          apiId:"SUA00632",
          criteria:{
            modId:ModId
          }
      }

          await axios.post (process.env.REACT_APP_API_URL_PREFIX + '/SUF00112/getAllListPageData', obj, {headers}).then((res)=>{
              console.log(res.data);
              if(res.data?.content?.qryRsltSet?.length){
                const modifData=res.data?.content?.qryRsltSet?.map((item)=>{
                  return{
                    ...item,
                    uploadDt:moment(item.uploadDt).format("DD-MM-YYYY")
                  }
                })
              setTableData(modifData);
              }
              console.log(openData);
              setMsg(res?.data?.appMsgList?.list[0]?.errDesc?
                  res?.data?.appMsgList?.list[0]?.errDesc +" ("+ res?.data?.appMsgList?.list[0]?.errCd+")":"");
              setMsgTyp(res?.data?.appMsgList?.list[0]?.errType)
          })
      }
      fetchOpenData()
  },[])  

  
const handleExportRows = (rows) => {
  csvExporter.generateCsv(rows.map((row) => row.original));
};

const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
  if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
  }
};

const resetForm = () => {
  setTableData([])
  setQueryInputObj({
      apiId: "SUA00086",
      criteria: {
          modGrpNm: ''
      }
  })
  setMsg("")
  setMsgTyp("")

};

const [msg, setMsg] = useState("")
    const [msgTyp, setMsgTyp] = useState("")
const [queryInputObj, setQueryInputObj] = useState({
  apiId: "SUA00086",
  criteria: {
      modGrpNm: ''
  }
})

const handleCancelRowEdits = () => {
  setValidationErrors({});
};

const [createModalOpen, setCreateModalOpen] = useState({
  open: false,
  mode: 0,
  rowId: -1,
  row: null,
  rowData: null
});


const csvExporter = new ExportToCsv(csvOptions);
  const columns = useMemo(
    () => [
     
      {
        accessorKey: "docId",
        header: "Document Id",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: true,
        size: 80,
    },
   






        {
            accessorKey: "docNm",
            header: "Document Name",
            enableColumnOrdering: false,
            enableEditing: false, //disable editing on this column
            enableSorting: true,
            size: 80,
        },
        {
            accessorKey: "uploadDt",
            header: "Upload Date",
            size: 240,
  
        },
        // {
        //     accessorKey: "actFlgTxt",
        //     header: "Status",
        //     size: 40,
  
        // }
  
    ],
  
  );

  const download_file = async(row)=>{
    console.log(row?.original);
    const obj = {
      apiId: "SUA00488",
      mst: {
        fileId: row?.original?.fileId,
        fileNm: row?.original?.fileNm
      }
    }
    // await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile",
    // obj, {headers})
    // .then((res) => {
    //  await fetch(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile", 
    //  {
    //     method: 'POST',
    //     headers: {
    //       ...headers,
    //       'Content-Type': 'application/octet-stream',
    //     },
    //     body: JSON.stringify(obj)

    //   })
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //   // Create blob link to download
    //   const url = window.URL.createObjectURL(
    //     new Blob([blob]),
    //   );
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute(
    //     'download'
    //   );
  
    //   // Append to html link element page
    //   document.body.appendChild(link);
  
    //   // Start download
    //   link.click();
  
    //   // Clean up and remove the link
    //   link.parentNode.removeChild(link);
    // })
    await axios.post(process.env.REACT_APP_API_URL_PREFIX+"/SUF00134/downloadFile",obj, {
      headers: {
          Authorization: headers?.Authorization,
          Accept: "application/zip"
      },
      responseType: 'arraybuffer',
    })
    .then((res) => {
      //fileDownload(res.data, "file.pdf")
      const url = window.URL.createObjectURL(
            new Blob([res.data]),
          );
          const tempArr = row?.original?.fileNm?.split(".") || [];
          const extention = tempArr[tempArr?.length-1] || "pdf"
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download', row?.original?.fileId+"."+extention
          );
           // Append to html link element page
          document.body.appendChild(link);
      
          // Start download
          link.click();
      
          // Clean up and remove the link
          //link.parentNode.removeChild(link);
    })
  }


  return (
    <div>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Module Document</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Module Document
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          {/* <Link to="#" className="btn btn-primary btn-icon text-white me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            Add Account
          </Link>
          <Link to="#" className="btn btn-success btn-icon text-white">
            <span>
              <i className="fe fe-log-in"></i>&nbsp;
            </span>
            Export
          </Link> */}
        </div>
      </div>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
      <p>
        {/* <span>
              <i className="fe fe-book"></i>&nbsp;
            </span>  */}
        {/*  <Link to={`${process.env.PUBLIC_URL}/#`} target='_blank'>Help Document</Link>  */}

        <h3 className="card-"> Manual and Presentation</h3>
      </p>

      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        //enableStickyHeader
        //muiTableContainerProps={{ sx: { maxHeight: '800px' } }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        positionActionsColumn="last"
        // enableRowSelection
        enableColumnOrdering
        enableEditing
        positionToolbarAlertBanner="bottom"
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            {/* <Tooltip arrow placement="left" title="Edit">
              <IconButton color="success" onClick={() => setCreateModalOpen({
                open: true,
                mode: 2,
                rowData: tableData[row.index],
                index: row.index,
                queryInputObj
                //rowData:[1,2,3]
              })}>
                <Edit />
              </IconButton>
            </Tooltip> */}
            <Tooltip arrow placement="right" title="View">
              <IconButton color="warning"  onClick={() =>
                            window.open(
                              process.env.REACT_APP_API_URL_PREFIX +
                              row.original.fileUri,
                              "_blank",
                              "rel=noopener noreferrer"
                            )
                          }>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Download">
              <IconButton color="black" onClick={() =>  download_file(row)}>
                <DownloadIcon/>
              </IconButton>
            </Tooltip> 

          </Box>
        )}
        // renderTopToolbarCustomActions={({ table }) => (
        //   <>
        //     <Box
        //       sx={{
        //         display: "flex",
        //         gap: "1rem",
        //         p: "0.5rem",
        //         flexWrap: "wrap",
        //       }}
        //     >
        //       <Button
        //         className="btn btn-primary fs-10"
        //         //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        //         onClick={handleExportData}
        //         startIcon={<FileDownloadIcon />}
        //         variant="contained"
        //       >
        //         Export All Data
        //       </Button>
        //       <Button
        //         className="btn btn-primary fs-10"
        //         disabled={table.getPrePaginationRowModel().rows.length === 0}
        //         //export all rows, including from the next page, (still respects filtering and sorting)
        //         onClick={() =>
        //           handleExportRows(table.getPrePaginationRowModel().rows)
        //         }
        //         startIcon={<FileDownloadIcon />}
        //         variant="contained"
        //       >
        //         Export All Rows
        //       </Button>
        //       <Button
        //         className="btn btn-primary fs-10"
        //         disabled={table.getRowModel().rows.length === 0}
        //         //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
        //         onClick={() => handleExportRows(table.getRowModel().rows)}
        //         startIcon={<FileDownloadIcon />}
        //         variant="contained"
        //       >
        //         Export Page Rows
        //       </Button>
        //       <Button
        //         className="btn btn-primary fs-10"
        //         disabled={
        //           !table.getIsSomeRowsSelected() &&
        //           !table.getIsAllRowsSelected()
        //         }
        //         //only export selected rows
        //         onClick={() =>
        //           handleExportRows(table.getSelectedRowModel().rows)
        //         }
        //         startIcon={<FileDownloadIcon />}
        //         variant="contained"
        //       >
        //         Export Selected Rows
        //       </Button>
        //     </Box>
        //   </>
        // )}
      />




      {/* <Row> */}
   

      {/* <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h3 className="card-title mb-0">Request Status</h3>
            </Card.Header>
            <Card.Body>
              <div className="salesdatatable">
                <div className="table-responsive">
                <DataTableExtensions {...tableDatas} >
          <DataTable 
           columns={columns}  
         data={data}
          noHeader
          defaultSortField="id"
          defaultSortAsc={false}
          striped={true}
          center={true}
          persistTableHead
          pagination
          highlightOnHover />
          </DataTableExtensions>
               
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}
