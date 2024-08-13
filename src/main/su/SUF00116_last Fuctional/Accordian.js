import React, { useState } from 'react';
import { Button, message, Steps, theme } from 'antd';

import {Dialog, DialogContent, DialogTitle, DialogContentText, IconButton } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import Request from './Request';

const steps = [
    {
        title: 'Request',
        content: <Request/>
    },
    {
        title: 'Response',
        
    },
    {
        title: 'Demo',
        
    },



];

const CustomSteps = ({ current, onChange, items }) => {
    const handleClick = (index) => {
        if (onChange) {
            onChange(index);
        }
    };

    return (
        <Steps current={current} className='py-5'>
            {items.map((item, index) => (
                <Steps.Step key={item.key} title={item.title} onClick={() => handleClick(index)} />
            ))}
        </Steps>
    );
};

function Accordian() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDone = () => {
      setDialogOpen(true);
    };
    const closeDialog = () => {
        setDialogOpen(false);
      };
    const next = () => {
        setCurrent((prevCurrent) => prevCurrent + 1);
    };

    const prev = () => {
        setCurrent((prevCurrent) => prevCurrent - 1);
    };

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <>
            <CustomSteps current={current} onChange={setCurrent} items={items} />
            <div>{steps[current].content}</div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={next}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={handleDone}>
                        Done
                    </Button>
                )}
                {current > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={prev}
                    >
                        Previous
                    </Button>
                )}
            </div>
            <Dialog open={dialogOpen} onClose={closeDialog} style={{zIndex:"9999"}}>
        <DialogTitle sx={{ m: 1, p: 2 }} >
      
      
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <div className="text-center">
          <i className="fe fe-check-circle fs-100 text-success lh-1 mb-4 d-inline-block"></i>
          <h4 className="text-success mb-4">Successfully Saved!</h4>
          </div>
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={closeDialog} color="primary">
            OK
          </Button>
        </DialogActions> */}
      </Dialog>
        </>
    );
}
export default Accordian;