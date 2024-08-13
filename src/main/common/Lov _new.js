import React, { useEffect, useState } from 'react'
import { MaterialReactTable } from "material-react-table";
import {
    Modal,

  } from "react-bootstrap";
  import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    
} from "@mui/material";

function Lov({moduleLovData, showModel, setShowModel, handleRowClick, columns, titel="Select Option", maxWidth="sm", currentSelection, setCurrentSelection
  ,loading
}) {
    const [rowSelection, setRowSelection] = useState(currentSelection);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
      //do something when the row selection changes...
      if(rowSelection && clicked) setTimeout(() => {
        handleRowClick(rowSelection)
        setShowModel(false)
      }, "150");
      setClicked(true)
    }, [rowSelection]);
    
   

    const handleCloseModal = () => {
      setShowModel(false);
    };

    const clearModle = ()=>{
      setRowSelection({})
      setCurrentSelection({})
    }
    

    return (
      <>
        <div className="row-mb-12">
         

          
          {(
            <div style={{zIndex: 1000}}>
            <Dialog fullWidth={true}
        maxWidth={maxWidth} open={showModel} >
            <DialogTitle sx={{ m: 1, p: 2 }} >{titel}</DialogTitle>
            <DialogContent className="pb-0" >
            
              {moduleLovData.length?
                <MaterialReactTable
      displayColumnDefOptions={{
        "mrt-row-actions": {
          muiTableHeadCellProps: {
            align: "center",
          },
          size: 100,
        },
      }}
      columns={columns}
      data={moduleLovData}
      initialState={{ density: "compact" }} //set the toogle button
      editingMode="modal" //default
      enableRowSelection
      enableMultiRowSelection={false}
      enableColumnOrdering
      // enableEditing="false"
      enableFullScreenToggle={false}
      onRowSelectionChange={setRowSelection}
      state={{ rowSelection }}
      positionToolbarAlertBanner="bottom"
    />: "Loading..."}
              
            <DialogActions sx={{ p: "1.25rem" }}>
              <Button onClick={handleCloseModal}>Close</Button>
              <Button onClick={clearModle}>Clear</Button>
            </DialogActions>
            </DialogContent>
            </Dialog>
            </div>
          )}

          
        </div>
      </>
    );
}

export default Lov