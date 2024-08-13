import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Modal, ModalTitle, Card ,Form} from "react-bootstrap";
//import * as formelement from "../../../data/Form/formelement/formelement";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
//import { CustomTree } from "../../../components/Test";
import { Checkbox } from 'antd';
const ApiFormMapping = () => {

    const data = [
        {
            id: 327,
            DistrictName: "DARJEELING"
        },
        {
            id: 328,
            DistrictName: "JALPAIGURI"
        },
        {
            id: 329,
            DistrictName: "COOCH BEHAR"
        },
        {
            id: 330,
            DistrictName: "UTTAR DINAJPUR"
        },
        {
            id: 331,
            DistrictName: "DAKSHIN DINAJPUR"
        },
        {
            id: 332,
            DistrictName: "MALDAH"
        },
        {
            id: 333,
            DistrictName: "MURSHIDABAD"
        },
        {
            id: 334,
            DistrictName: "BIRBHUM"
        },
        {
            id: 335,
            DistrictName: "PURBA BARDHAMAN"
        },
        {
            id: 336,
            DistrictName: "NADIA"
        },
        {
            id: 337,
            DistrictName: "NORTH 24 PARGANAS"
        },
        {
            id: 338,
            DistrictName: "HOOGLY"
        },
        {
            id: 339,
            DistrictName: "BANKURA"
        },
        {
            id: 340,
            DistrictName: "PURULIA"
        },
        {
            id: 341,
            DistrictName: "HOWRAH"
        }
    ];

    const data2 = [
        {
            id: 327,
            DistrictName: "DARJEELING"
        },
        {
            id: 328,
            DistrictName: "JALPAIGURI"
        },
        {
            id: 329,
            DistrictName: "COOCH BEHAR"
        },
        {
            id: 330,
            DistrictName: "UTTAR DINAJPUR"
        },
        {
            id: 331,
            DistrictName: "DAKSHIN DINAJPUR"
        },
        {
            id: 332,
            DistrictName: "MALDAH"
        },
        {
            id: 333,
            DistrictName: "MURSHIDABAD"
        },
        {
            id: 334,
            DistrictName: "BIRBHUM"
        },
        {
            id: 335,
            DistrictName: "PURBA BARDHAMAN"
        },
        {
            id: 336,
            DistrictName: "NADIA"
        },
        {
            id: 337,
            DistrictName: "NORTH 24 PARGANAS"
        },
        {
            id: 338,
            DistrictName: "HOOGLY"
        },
        {
            id: 339,
            DistrictName: "BANKURA"
        },
        {
            id: 340,
            DistrictName: "PURULIA"
        },
        {
            id: 341,
            DistrictName: "HOWRAH"
        }
    ];

    const data3 = [
        {
            id: 327,
            DistrictName: "DARJEELING"
        },
        {
            id: 328,
            DistrictName: "JALPAIGURI"
        },
        {
            id: 329,
            DistrictName: "COOCH BEHAR"
        },
        {
            id: 330,
            DistrictName: "UTTAR DINAJPUR"
        },
        {
            id: 331,
            DistrictName: "DAKSHIN DINAJPUR"
        },
        {
            id: 332,
            DistrictName: "MALDAH"
        },
        {
            id: 333,
            DistrictName: "MURSHIDABAD"
        },
        {
            id: 334,
            DistrictName: "BIRBHUM"
        },
        {
            id: 335,
            DistrictName: "PURBA BARDHAMAN"
        },
        {
            id: 336,
            DistrictName: "NADIA"
        },
        {
            id: 337,
            DistrictName: "NORTH 24 PARGANAS"
        },
        {
            id: 338,
            DistrictName: "HOOGLY"
        },
        {
            id: 339,
            DistrictName: "BANKURA"
        },
        {
            id: 340,
            DistrictName: "PURULIA"
        },
        {
            id: 341,
            DistrictName: "HOWRAH"
        }
    ];

    const data4 = [
        {
            BeanSlNo: 1,
            id: 327,
            BeanName: "DARJEELING",
            BaseTable: 123,
            BaseName: 456
        },
        {
            BeanSlNo: 2,
            id: 328,
            BeanName: "JALPAIGURI",
            BaseTable: 456,
            BaseName: 123
        },
        {
            BeanSlNo: 3,
            id: 329,
            BeanName: "COOCH BEHAR",
            BaseTable: 789,
            BaseName: 123
        },
        {
            BeanSlNo: 11,
            id: 330,
            BeanName: "UTTAR DINAJPUR",
            BaseTable: 123,
            BaseName: 789
        },
        {
            BeanSlNo: 4,
            id: 331,
            BeanName: "DAKSHIN DINAJPUR",
            BaseTable: 145,
            BaseName: 234
        },
        {
            BeanSlNo: 5,
            id: 332,
            BeanName: "MALDAH",
            BaseTable: 347,
            BaseName: 112
        },
        {
            BeanSlNo: 6,
            id: 333,
            BeanName: "MURSHIDABAD",
            BaseTable: 146,
            BaseName: 447
        },
        {
            BeanSlNo: 7,
            id: 334,
            BeanName: "BIRBHUM",
            BaseTable: 578,
            BaseName: 547
        },
        {
            BeanSlNo: 8,
            id: 335,
            BeanName: "PURBA BARDHAMAN",
            BaseTable: 560,
            BaseName: 224
        },
        {
            BeanSlNo: 9,
            id: 336,
            BeanName: "NADIA",
            BaseTable: 568,
            BaseName: 336
        },
        {
            BeanSlNo: 10,
            id: 337,
            BeanName: "NORTH 24 PARGANAS",
            BaseTable: 567,
            BaseName: 221
        },
        {
            BeanSlNo: 11,
            id: 338,
            BeanName: "HOOGLY",
            BaseTable: 446,
            BaseName: 227
        },
        {
            BeanSlNo: 12,
            id: 339,
            BeanName: "BANKURA",
            BaseTable: 443,
            BaseName: 345
        },
        {
            BeanSlNo: 13,
            id: 340,
            DistrictName: "PURULIA",
            BaseTable: 356,
            BaseName: 344
        },
        {
            BeanSlNo: 4,
            id: 341,
            BeanName: "HOWRAH",
            BaseTable: 567,
            BaseName: 432
        }
    ];
    const [rightItems, setRightItems] = useState([]);
    const [leftItems, setLeftItems] = useState([
        { id: 1, label: 'Option 1', selected: false },
        { id: 2, label: 'Option 2', selected: false },
        { id: 3, label: 'Option 3', selected: false },
        { id: 4, label: 'Option 4', selected: false },
    ]);
    const handleSelectItem = (item, direction) => {
        const updatedItems =
            direction === 'left'
                ? leftItems.map((i) => (i.id === item.id ? { ...i, selected: !i.selected } : i))
                : rightItems.map((i) => (i.id === item.id ? { ...i, selected: !i.selected } : i));

        direction === 'left' ? setLeftItems(updatedItems) : setRightItems(updatedItems);
    };

    const handleTransfer = (direction) => {
        if (direction === 'right') {
            const selectedItems = leftItems.filter((item) => item.selected);
            setLeftItems(leftItems.filter((item) => !item.selected));
            setRightItems([...rightItems, ...selectedItems.map(item => ({ ...item, selected: false }))]);
        } else if (direction === 'left') {
            const selectedItems = rightItems.filter((item) => item.selected);
            setRightItems(rightItems.filter((item) => !item.selected));
            setLeftItems([...leftItems, ...selectedItems.map(item => ({ ...item, selected: false }))]);
        }
    };

    const [leftSelectedKeys, setLeftSelectedKeys] = useState([]);
    const [rightSelectedKeys, setRightSelectedKeys] = useState([]);
    const [rightBoxItems, setRightBoxItems] = useState([]);
    const [treeData, setTreeData] = useState([
        // Your treeData here
        {
            title: 'parent 0',
            key: '0-0',
            children: [
                {
                    title: 'leaf 0-0',
                    key: '0-0-0',
                    isLeaf: true,
                },
                {
                    title: 'leaf 0-1',
                    key: '0-0-1',
                    isLeaf: true,
                },
            ],
        },
        {
            title: 'parent 1',
            key: '0-1',
            children: [
                {
                    title: 'leaf 1-0',
                    key: '0-1-0',
                    isLeaf: true,
                },
                {
                    title: 'leaf 1-1',
                    key: '0-1-1',
                    isLeaf: true,
                },
            ],
        },
    ]);

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});

    // const [createModalOpen, setCreateModalOpen] = useState(false);
    const [approval, setApproval] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchText2, setSearchText2] = useState('');
    const [searchText3, setSearchText3] = useState('');

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const [tableData, setTableData] = useState(data);
    const [tableData2, setTableData2] = useState(data2);
    const [tableData3, setTableData3] = useState(data3);
    const [tableData4, setTableData4] = useState(data4);

    const [filteredData, setFilteredData] = useState([]);
    const [filteredData2, setFilteredData2] = useState([]);
    const [filteredData3, setFilteredData3] = useState([]);

    const [selectRow, setSelectRow] = useState(null);
    const [selectRow2, setSelectRow2] = useState(null);
    const [selectRow3, setSelectRow3] = useState(null);

    function handleClick() {
        setApproval(selectRow == null  ? false : true);
    }

    const handleRowClick = (rowData) => {
        setSelectRow(rowData);
        setOpen(false);
    };

    const handleRowClick2 = (rowData2) => {
        setSelectRow2(rowData2);
        setOpen2(false);
    };

    const handleRowClick3 = (rowData3) => {
        setSelectRow3(rowData3);
        setOpen3(false);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const closeModal2 = () => {
        setOpen2(false);
    };

    const closeModal3 = () => {
        setOpen3(false);
    };

    const openModal = () => {
        setTableData(data);
        setOpen(true);
    };

    const openModal2 = () => {
        setTableData2(data2);
        setOpen2(true);
    };

    const openModal3 = () => {
        setTableData3(data3);
        setOpen3(true);
    };

    const handleSearch = () => {
        // Filter the table data based on the search text
        const filteredData = tableData.filter(
            (row) =>
                row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
                row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filteredData);
    };

    const handleSearch2 = () => {
        // Filter the table data based on the search text
        const filteredData2 = tableData2.filter(
            (row2) =>
                row2.id.toString().toLowerCase().includes(searchText2.toLowerCase()) ||
                row2.DistrictName.toLowerCase().includes(searchText2.toLowerCase())
        );
        setFilteredData2(filteredData2);
    };

    const handleSearch3 = () => {
        // Filter the table data based on the search text
        const filteredData3 = tableData3.filter(
            (row3) =>
                row3.id.toString().toLowerCase().includes(searchText3.toLowerCase()) ||
                row3.DistrictName.toLowerCase().includes(searchText3.toLowerCase())
        );
        setFilteredData3(filteredData3);
    };

    useEffect(() => {
        // Update the filtered data when the table data changes
        setFilteredData(tableData);
    }, [tableData]);

    useEffect(() => {
        // Update the filtered data when the table data changes
        setFilteredData2(tableData2);
    }, [tableData2]);

    useEffect(() => {
        // Update the filtered data when the table data changes
        setFilteredData3(tableData3);
    }, [tableData3]);

    useEffect(() => {
        // Reset the table data when the modal is closed
        if (!open) {
            setTableData(data);
            setFilteredData(data);
            setSearchText('');
        }
    }, [open]);

    useEffect(() => {
        // Reset the table data when the modal is closed
        if (!open2) {
            setTableData2(data2);
            setFilteredData2(data2);
            setSearchText2('');
        }
    }, [open2]);

    useEffect(() => {
        // Reset the table data when the modal is closed
        if (!open3) {
            setTableData3(data3);
            setFilteredData3(data3);
            setSearchText3('');
        }
    }, [open3]);

    const handleReset = () => {
        setSelectRow(null);
        setSearchText("");
        setSelectRow2(null);
        setSearchText2("");
        setSelectRow3(null);
        setSearchText3("");
        setApproval(false);
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

    const handleCreateNewRow = (values) => {
        tableData4.push(values);
        setTableData4([...tableData4]);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "BeanSlNo",
                header: "Bean Sl No",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: "id",
                header: "Bean Code",
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: "BeanName",
                header: "Bean Name",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "BaseTable",
                header: "Base Table",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: "BaseName",
                header: "Table Name",
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            }
        ],
        [getCommonEditTextFieldProps]
    );

    const handleRightShift = () => {
        const selectedItems = [];
        leftSelectedKeys.forEach((key) => {
            const node = findNodeByKey(treeData, key);
            if (node && !rightBoxItems.some((item) => item.key === node.key)) {
                // Check if the node is not already in the right box before adding it
                selectedItems.push(node);
                getAllSelectedKeys(node, leftSelectedKeys);
            }
        });

        setRightBoxItems([...rightBoxItems, ...selectedItems]);
        setLeftSelectedKeys([]); // Clear selected items from left box after shift
    };

    const handleLeftShift = () => {
        const selectedItems = [];
        rightSelectedKeys.forEach((key) => {
            const node = findNodeByKey(rightBoxItems, key);
            if (node) {
                selectedItems.push(node);
                getAllSelectedKeys(node, rightSelectedKeys);
            }
        });

        setRightBoxItems((prevItems) => prevItems.filter((item) => !rightSelectedKeys.includes(item.key)));
        setRightSelectedKeys([]); // Clear selected items from right box after shift
    };

    const getAllSelectedKeys = (node, selectedKeys) => {
        if (!node) return;
        selectedKeys.push(node.key);
        if (node.children) {
            node.children.forEach((child) => getAllSelectedKeys(child, selectedKeys));
        }
    };

    const findNodeByKey = (data, key) => {
        for (let node of data) {
            if (node.key === key) {
                return node;
            }
            if (node.children) {
                const foundNode = findNodeByKey(node.children, key);
                if (foundNode) return foundNode;
            }
        }
        return null;
    };

    return (
        <>
            <div >
                
                <div className="">
                
                <div className="row m-4">
                <Form.Group className="from-group ">
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                                <Card>
                                    <List className="border border-primary" >
                                        <Box sx={{
                                            width: '100%', // Set the width to 100% to make it responsive
                                            maxWidth: '400px', // Set a maximum width for larger screens
                                            minHeight: '300px', // Set a minimum height for the Box
                                            minWidth: '400px', // Let the height be auto to adjust based on content
                                            margin: 0, // Remove margin
                                            padding: 0, // Remove padding
                                            display: 'flex', // Use flex display to center content vertically
                                            flexDirection: 'column', // Align items vertically
                                            justifyContent: 'center', // Center content vertically
                                            alignItems: 'center', // Center content horizontally
                                            '@media (max-width: 600px)': {
                                                minWidth: '100%', // Adjust the minWidth for mobile devices
                                                maxWidth: '100%', // Adjust the maxWidth for mobile devices
                                            },
                                        }}>
                                            {approval &&
                                                leftItems.map((item) => (

                                                    <ListItem key={item.id} disablePadding>
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onChange={() => handleSelectItem(item, 'left')}
                                                            color="primary"
                                                            className="mx-1"
                                                        />
                                                        <ListItemText primary={item.label} />
                                                    </ListItem>

                                                ))
                                            }
                                        </Box>
                                    </List>
                                </Card>



                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Button className="btn btn-info" variant="contained" color="primary" onClick={() => handleTransfer('right')}>
                                        &gt;
                                    </Button>
                                    <br></br>
                                    <Button className="btn btn-info" variant="contained" color="primary" onClick={() => handleTransfer('left')}>
                                        &lt;
                                    </Button>
                                </Box>
                                <Card>
                                    <List class="border border-primary">
                                        <Box sx={{
                                            width: '100%', // Set the width to 100% to make it responsive
                                            maxWidth: '400px', // Set a maximum width for larger screens
                                            minHeight: '300px', // Set a minimum height for the Box
                                            minWidth: '400px', // Let the height be auto to adjust based on content
                                            margin: 0, // Remove margin
                                            padding: 0, // Remove padding
                                            display: 'flex', // Use flex display to center content vertically
                                            flexDirection: 'column', // Align items vertically
                                            justifyContent: 'center', // Center content vertically
                                            alignItems: 'center', // Center content horizontally
                                            '@media (max-width: 600px)': {
                                                minWidth: '100%', // Adjust the minWidth for mobile devices
                                                maxWidth: '100%', // Adjust the maxWidth for mobile devices
                                            },
                                        }}>
                                            {approval &&
                                                rightItems.map((item) => (
                                                    <ListItem key={item.id} disablePadding>
                                                        <Checkbox
                                                            checked={item.selected}
                                                            onChange={() => handleSelectItem(item, 'right')}
                                                            color="primary"
                                                        />
                                                        <ListItemText primary={item.label} />
                                                    </ListItem>
                                                ))}
                                        </Box>

                                    </List>
                                </Card>

                            </Box>

                        </Form.Group>
                </div>
                    {/* <div className='row mb-12 py-2 me-8 d-flex justify-content-end'>
                        <div className='col-lg-5 form-horizontal border border-primary'>


                        </div>
                    </div> */}
                </div>
                
            </div>

            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
        </>
    );
};

export default ApiFormMapping;
//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ""] = "";
            return acc;
        }, {})
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open} >
            <DialogTitle textAlign="center">Create New Account</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: "100%",
                            minWidth: { xs: "300px", sm: "360px", md: "400px" },
                            gap: "1.5rem",
                        }}
                    >
                        {columns.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: "1.25rem" }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Select Module
                </Button>
            </DialogActions>
        </Dialog>
    );
};
const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
const validateAge = (age) => age >= 18 && age <= 50;