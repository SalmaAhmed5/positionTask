import { TableCell, TableRow } from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Card, CardContent, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { Add } from "@mui/icons-material";

function ChildRow({
  historyRow,
  index,
  parentIndex,
  deleteRow,
  editRow,
  SaveEditData,
  moveHistoryRow,
  nameEditing,
  editingNameValue,
  setEditingNameValue,
  setEditingName,
  SaveEdiRow,
  editId,
  setEditId,
}) {
  const ItemTypes = {
    POSITION: "position",
    HISTORY_ROW: "historyRow",
  };
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.HISTORY_ROW,
    item: { index, parentIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.HISTORY_ROW,
    hover: (draggedItem) => {
      if (
        draggedItem.parentIndex !== parentIndex ||
        draggedItem.index !== index
      ) {
        moveHistoryRow(
          draggedItem.index,
          draggedItem.parentIndex,
          parentIndex,
          index
        );
        draggedItem.parentIndex = parentIndex;
        draggedItem.index = index;
      }
    },
  });

  return (
    <TableRow
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <TableCell component="th" scope="row">
        <IconButton size="small">
          <DragIndicatorIcon />
        </IconButton>
      </TableCell>

      {editId === historyRow.id ? (
        <TableCell colSpan={2}>
          <TextField
            label="Name"
            value={editingNameValue || historyRow?.name}
            onChange={(e) => setEditingNameValue(e.target.value)}
            size="small"
          />
        </TableCell>
      ) : (
        <TableCell colSpan={2}>{historyRow?.name}</TableCell>
      )}

      <TableCell colSpan={2} align="center">
        <div className="flex gap-3 justify-center">
          {editId === historyRow.id ? (
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => editRow(index, parentIndex)}
                startIcon={<CreateIcon />}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={() => deleteRow(index, parentIndex)}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
export default ChildRow;
