import { TableCell, TableRow } from "@mui/material";
import React from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Card, CardContent, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { Add } from "@mui/icons-material";
import ChildRow from "../ChildRow";

function Row({
  rows,
  row,
  rowIndex,
  deleteRow,
  editRow,
  SaveEditData,
  SaveEdiRow,
  setRows,
  movechildrenRow,
  movePosition,
  nameEditing,
  editPosition,
  setEditingName,
  setEditingNameValue,
  editingNameValue,
  editId,
  setEditId,
  level,
}) {
  const [open, setOpen] = React.useState(false);
  const [newNameValue, setNewNameValue] = React.useState("");
  const [NewName, AddNew] = React.useState(false);

  const ItemTypes = {
    POSITION: "position",
    children_ROW: "childrenRow",
  };
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.POSITION,
    item: { index: rowIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.POSITION,
    hover: (draggedItem) => {
      if (draggedItem.index !== rowIndex) {
        movePosition(draggedItem.index, rowIndex);
        draggedItem.index = rowIndex;
      }
    },
  });

  const AddNewName = (row, parentIndex) => {
    // Logic to add a new children row
    const newchildrenRow = {
      name: newNameValue,
      id: row.children.length > 0 ? row.children.length + 1 : 1,
      edit: (
        <div className="flex gap-3 justify-center">
          <Button variant="contained" startIcon={<CreateIcon />}>
            Edit
          </Button>
          <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </div>
      ),
    };

    // Add new children row
    const updatedRows = rows.map((item, index) =>
      index === parentIndex
        ? { ...item, children: [...item.children, newchildrenRow] }
        : item
    );

    setRows(updatedRows); // Update state with new row data
    setNewNameValue(""); // Reset input field
  };

  return (
    <React.Fragment>
      <TableRow
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
        ref={(node) => drag(drop(node))}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <TableCell>
          <IconButton size="small">
            <DragIndicatorIcon />
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" colSpan={2}>
          {row.name}
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // Prevents the click from reaching the TableRow
              editPosition(row); // Call the edit function
            }}
          >
            <CreateIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className="bg-[#e0e0e054]">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="large" aria-label="children">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={2} className="!font-semibold">
                    Name
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className="!font-semibold"
                    align="center"
                  >
                    Actions
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {row?.children?.map((childrenRow, index) => (
                  <>
                    <ChildRow
                      key={childrenRow?.name}
                      childrenRow={childrenRow}
                      index={index}
                      parentIndex={rowIndex}
                      deleteRow={deleteRow}
                      editRow={editRow}
                      SaveEditData={SaveEditData}
                      movechildrenRow={movechildrenRow}
                      nameEditing={nameEditing}
                      editingNameValue={editingNameValue}
                      setEditingNameValue={setEditingNameValue}
                      setEditingName={setEditingName}
                      SaveEdiRow={SaveEdiRow}
                      editId={editId}
                      setEditId={setEditId}
                      setNewNameValue={setNewNameValue}
                      setRows={setRows}
                      level={childrenRow.level}
                    />
                  </>
                ))}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>
                    <TextField
                      label="Name"
                      value={newNameValue}
                      onChange={(e) => setNewNameValue(e.target.value)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell colSpan={3} align="center">
                    <Button
                      color="success"
                      variant="contained"
                      disabled={!newNameValue}
                      onClick={() => AddNewName(row, rowIndex)}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default Row;
