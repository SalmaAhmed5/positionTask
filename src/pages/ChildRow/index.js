import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Collapse,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";

const ChildRow = ({
  childrenRow,
  index,
  parentIndex,
  deleteRow,
  editRow,
  SaveEditData,
  movechildrenRow,
  nameEditing,
  editingNameValue,
  setEditingNameValue,
  SaveEdiRow,
  editId,
  setEditId,
  setRows,
}) => {
  const [open, setOpen] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildTitle, setNewChildTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const addChildToTree = (nodes, parentId, newChild) => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        console.log("Adding child to node:", node); // Log the target node
        return {
          ...node,
          children: [
            ...node.children,
            {
              ...newChild,
              id: Date.now(),
              level: node.level + 1,
              children: [],
            },
          ],
        };
      }

      if (node?.children && node?.children.length > 0) {
        return {
          ...node,
          children: addChildToTree(node?.children, parentId, newChild),
        };
      }

      // Return node as is if no modifications are needed
      return node;
    });
  };
  const addChild = (parentId, newChildName) => {
    if (!newChildName.trim()) {
      setErrorMessage(true); // Set error message
      return;
    }
    if (!newChildName.trim()) return; // Prevent adding empty child names

    const newChild = {
      name: newChildName,
      id: Date.now(), // or any unique ID generator
      level: 0, // This will be updated in addChildToTree
      children: [],
    };

    setRows((prevRows) => {
      const updatedRows = addChildToTree(prevRows, parentId, newChild);
      console.log("Updated data structure:", updatedRows);
      setNewChildName(""); // Reset input field after adding
      return updatedRows;
    });
  };

  return (
    <>
      <TableRow onClick={() => setOpen(!open)}>
        <TableCell component="th" scope="row">
          <IconButton size="small">
            <DragIndicatorIcon />
          </IconButton>
        </TableCell>

        {editId === childrenRow.id ? (
          <TableCell colSpan={2}>
            <TextField
              label="Name"
              value={editingNameValue || childrenRow?.name}
              onChange={(e) => setEditingNameValue(e.target.value)}
              size="small"
            />
          </TableCell>
        ) : (
          <TableCell colSpan={2}>{childrenRow?.name}</TableCell>
        )}
        <TableCell colSpan={2} align="center">
          <div className="flex gap-3 justify-center">
            {editId === childrenRow.id ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => SaveEdiRow(index, parentIndex)}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditId(null)} // Function to cancel edit
                  startIcon={<DeleteIcon />}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {" "}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the click from reaching the TableRow
                    editRow(index, parentIndex);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the click from reaching the TableRow
                    deleteRow(index, parentIndex);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow className="bg-[#e0e0e054]" colSpan={5}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table>
              <TableBody colSpan={5}>
                {childrenRow.children &&
                  childrenRow.children.map((childRow, childIndex) => (
                    <ChildRow
                      key={childRow.id}
                      childrenRow={childRow}
                      index={childIndex}
                      parentIndex={index}
                      deleteRow={deleteRow}
                      editRow={editRow}
                      SaveEditData={SaveEditData}
                      movechildrenRow={movechildrenRow}
                      nameEditing={nameEditing}
                      editingNameValue={editingNameValue}
                      setEditingNameValue={setEditingNameValue}
                      SaveEdiRow={SaveEdiRow}
                      editId={editId}
                      setEditId={setEditId}
                      setRows={setRows}
                    />
                  ))}

                <TableRow colSpan={5}>
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>
                    <TextField
                      size="small"
                      label="New Child Name"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      required
                    />
                    {errorMessage && (
                      <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span class="font-medium">Not Allowed to be empty</span>
                      </p>
                    )}
                  </TableCell>
                  <TableCell colSpan={3}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => addChild(childrenRow.id, newChildName)}
                    >
                      Add Child
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ChildRow;
