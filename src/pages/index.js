import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Card, CardContent, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import Row from "./Row";

function createData(name, description, id, level) {
  return {
    name,
    description,
    id,
    level,
    children: [
      {
        id: 1,
        name: "1",
        level: 1,
        edit: (
          <div className="flex gap-3 justify-center">
            <Button variant="contained" startIcon={<CreateIcon />}>
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </div>
        ),
        children: [],
      },
    ],
  };
}

export default function CollapsibleTable() {
  const [rows, setRows] = React.useState([]);
  const [newName, setNewName] = React.useState("");
  const [Editing, setEditing] = React.useState(false);
  const [newDescription, setNewDescription] = React.useState("");
  const [editId, setEditId] = React.useState(null);
  const [nameEditing, setEditingName] = React.useState(true);
  const [editingNameValue, setEditingNameValue] = React.useState("");
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/db.json"); // Use root-relative path

        if (!response.ok) {
          // Log the status and statusText if the response is not ok
          console.error(
            "Network response was not ok:",
            response.status,
            response.statusText
          );
          throw new Error("Network response was not ok");
        }

        const data = await response.json(); // Parse the response as JSON

        // Format the data to the structure your component needs
        const formattedData = data.map((item) =>
          createData(item.name, item.description, item.id, item.level)
        );
        setRows(formattedData); // Set the formatted data to your state
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const movechildrenRow = (
    draggedIndex,
    fromParentIndex,
    toParentIndex,
    toIndex = 0
  ) => {
    const updatedRows = [...rows];
    const [draggedRow] = updatedRows[fromParentIndex].children.splice(
      draggedIndex,
      1
    );
    updatedRows[toParentIndex].children.splice(toIndex, 0, draggedRow);
    setRows(updatedRows);
  };

  const deleteRow = (childIndex, parentIndex) => {
    const updatedRows = [...rows];
    updatedRows[parentIndex].children.splice(childIndex, 1);
    setRows(updatedRows);
  };

  const movePosition = (fromIndex, toIndex) => {
    const updatedRows = [...rows];
    const [movedRow] = updatedRows.splice(fromIndex, 1);
    updatedRows.splice(toIndex, 0, movedRow);
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    if (!newName) return;
    const updatedRows = [...rows];
    const newchildrenRow = {
      name: newName,
      description: newDescription,
      id: rows.length + 1,
      children: [],
    };
    updatedRows.push(newchildrenRow);
    setRows(updatedRows);
    setNewName("");
    setNewDescription("");
  };

  const editPosition = (data) => {
    setEditId(data.id);
    setEditing(true);
    setNewName(data.name);
    setNewDescription(data.description);
  };

  const CancelEditData = () => {
    setEditing(false);
    setNewName("");
    setNewDescription("");
  };

  const SaveEditData = () => {
    const updatedData = [...rows];
    const index = updatedData.findIndex((item) => item.id === editId);

    if (index !== -1) {
      updatedData[index] = {
        ...updatedData[index],
        name: newName,
        description: newDescription,
      };

      setRows(updatedData);
      setEditing(false);
      setEditId(null);
      setNewName("");
      setNewDescription("");
    }
  };

  const editRow = (index, parentIndex) => {
    setEditingName(false);
    setEditId(rows[parentIndex]?.children[index].id);
  };

  const SaveEdiRow = (index, parentIndex) => {
    const updatedData = [...rows];

    if (parentIndex !== null) {
      const childIndex = updatedData[parentIndex].children.findIndex(
        (child) => child.id === editId
      );

      if (childIndex !== -1) {
        updatedData[parentIndex].children[childIndex] = {
          ...updatedData[parentIndex].children[childIndex],
          name: editingNameValue,
        };
      }

      setRows(updatedData);
      setEditing(false);
      setEditId(null);
      setEditingName(true);
    }
  };

  return (
    <Paper elevation={9}>
      <Card className="max-h-[700px] !overflow-auto !min-w-[600px] !overflow-x-scroll">
        <CardContent>
          <div className="p-5">
            <Typography fontWeight="bold" variant="h5">
              Positions
            </Typography>
          </div>
          <form className="w-full">
            <div className="grid">
              <div className="grid items-center py-2 w-full">
                <TextField
                  label="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="!my-3 bg-white"
                  size="large"
                />
                <TextField
                  label="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="!my-3  bg-white"
                  multiline
                  rows={4}
                />
              </div>
              {!Editing && (
                <div className="flex items-center !mb-3 w-full">
                  <Button
                    color="success"
                    variant="contained"
                    fullWidth
                    type="button"
                    disabled={!newName}
                    onClick={() => handleAddRow()} // Call the add row function
                  >
                    Add
                  </Button>
                </div>
              )}
              {Editing && (
                <div className="flex items-center !mb-3 w-full gap-4">
                  <Button
                    color="success"
                    variant="contained"
                    type="button"
                    fullWidth
                    onClick={() => SaveEditData()} // Call the add row function
                  >
                    Save
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    type="button"
                    fullWidth
                    onClick={() => CancelEditData()} // Call the add row function
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </form>
          <DndProvider backend={HTML5Backend}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell colSpan={2}>Position</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <>
                      <Row
                        key={row.name}
                        setRows={setRows}
                        row={row}
                        rows={rows}
                        rowIndex={rowIndex}
                        deleteRow={deleteRow}
                        movePosition={movePosition}
                        movechildrenRow={movechildrenRow}
                        editPosition={editPosition}
                        editRow={editRow}
                        SaveEditData={SaveEditData}
                        SaveEdiRow={SaveEdiRow}
                        nameEditing={nameEditing}
                        setEditingNameValue={setEditingNameValue}
                        editingNameValue={editingNameValue}
                        editId={editId}
                        setEditId={setEditId}
                      />
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DndProvider>
        </CardContent>
      </Card>
    </Paper>
  );
}
