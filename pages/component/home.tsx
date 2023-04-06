import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import supabase from "@/comporment config/supabase";
import * as XLSX from "xlsx";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function CustomToolbar() {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          pb: 0,
          justifyContent: "center",
          mt: 2,
          bgcolor: "background.paper",
          borderRadius: 1,
          height: 60,
        }}
      >
        {" "}
        <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          {/* <GridToolbarExport /> */}
        </GridToolbarContainer>
        <GridToolbarQuickFilter
          sx={{ mt: 1 }}
          quickFilterParser={(searchInput: string) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
        ></GridToolbarQuickFilter>
      </Box>
    </div>
  );
}

const columns: GridColDef[] = [
  //   { field: "id", headerName: "ID", width: 90 },
  {
    field: "PD_key",
    headerName: "PD key",
    width: 150,
    editable: true,
  },
  {
    field: "Work_order_id",
    headerName: "Work order id",
    width: 150,
    editable: true,
  },
  {
    field: "Item_number",
    headerName: "Item number",
    width: 110,
    editable: true,
  },
  {
    field: "Production_unit",
    headerName: "Production_unit",
    width: 160,
  },
  {
    field: "Production_date",
    headerName: "Production_date",
    width: 160,
  },
  {
    field: "Shift",
    headerName: "Shift",
    width: 160,
  },
  {
    field: "Begin_time",
    headerName: "Begin_time",
    width: 160,
  },
  {
    field: "End_time",
    headerName: "End_time",
    width: 160,
  },
  {
    field: "Duration_time",
    headerName: "Duration_time [min]",
    width: 160,
  },
  {
    field: "Runtime",
    headerName: "Runtime [min]",
    width: 160,
  },
  {
    field: "Standard_time",
    headerName: "Standard_time [sec/pcs]",
    width: 180,
  },
  {
    field: "Manpower_number",
    headerName: "Manpower_number",
    width: 160,
  },
  {
    field: "OK_qty",
    headerName: "OK_qty",
    width: 160,
  },
  {
    field: "NG_F_qty",
    headerName: "NG_F_qty",
    width: 160,
  },
  {
    field: "NG_C_qty",
    headerName: "NG_C_qty",
    width: 160,
  },
  {
    field: "Cycle_time",
    headerName: "Cycle_time [min/pcs]",
    width: 160,
  },
  {
    field: "Availability_percent",
    headerName: "Availability_percent",
    width: 160,
  },
  {
    field: "Performance_percent",
    headerName: "Performance_percent",
    width: 160,
  },
  {
    field: "Quality_percent",
    headerName: "Quality_percent",
    width: 160,
  },
  {
    field: "OEE_percent",
    headerName: "OEE_percent",
    width: 160,
  },
  {
    field: "LT_number",
    headerName: "LT_number",
    width: 160,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function Homes() {
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  const [valueShift, setValueShift] = useState<any>("All");
  console.log("valueShift", valueShift);
  const router = useRouter();
  //   useEffect(() => {
  //     const fetchCheckID = async () => {
  //       let { data: userID, error } = await supabase
  //         .from("userID")
  //         .select("emp_no")
  //         .eq("emp_no", localStorage.getItem("emp_no"));
  //       if (userID?.length != 0) {
  //         console.log("Check ID OK :D");
  //       } else {
  //         router.push("www.google.com");
  //       }
  //     };
  //     fetchCheckID();
  //   }, []);
  const currentDate = `${year}-${month}-${day}`;
  const [dataShow, setDataShow] = useState<any>([]);
  //   console.log("dataShow", dataShow);

  const [valueStart, setValueStart] = useState<Dayjs | null>(
    dayjs(currentDate)
  );
  const [valueEnd, setValueEnd] = useState<Dayjs | null>(dayjs(currentDate));
  //   console.log("valueEnd", dayjs(valueEnd).format("YYYY-MM-DD"));

  useEffect(() => {
    if (valueShift == "All") {
      const fetchdataALL = async () => {
        let { data: Production_history, error } = await supabase
          .from("Production_history")
          .select("*")
          .eq("OBU_status", "Transfer_done")
          .filter("Shift", "in", '("Day","Night")')
          .gte("Production_date", dayjs(valueStart).format("YYYY-MM-DD"))
          .lte("Production_date", dayjs(valueEnd).format("YYYY-MM-DD"));
        if (!error) {
          console.log("fetch Success :D", Production_history);
          setDataShow(Production_history);
        } else {
          console.log("fetch Error !!!");
        }
      };
      fetchdataALL();
    }

    if (valueShift == "Day") {
      const fetchdataDay = async () => {
        let { data: Production_history, error } = await supabase
          .from("Production_history")
          .select("*")
          .eq("OBU_status", "Transfer_done")
          .filter("Shift", "in", '("Day")')
          .gte("Production_date", dayjs(valueStart).format("YYYY-MM-DD"))
          .lte("Production_date", dayjs(valueEnd).format("YYYY-MM-DD"));
        if (!error) {
          console.log("fetch Success :D", Production_history);
          setDataShow(Production_history);
        } else {
          console.log("fetch Error !!!");
        }
      };
      fetchdataDay();
    }

    if (valueShift == "Night") {
      const fetchdataNight = async () => {
        let { data: Production_history, error } = await supabase
          .from("Production_history")
          .select("*")
          .eq("OBU_status", "Transfer_done")
          .filter("Shift", "in", '("Night")')
          .gte("Production_date", dayjs(valueStart).format("YYYY-MM-DD"))
          .lte("Production_date", dayjs(valueEnd).format("YYYY-MM-DD"));
        if (!error) {
          console.log("fetch Success :D", Production_history);
          setDataShow(Production_history);
        } else {
          console.log("fetch Error !!!");
        }
      };
      fetchdataNight();
    }
  }, [valueEnd, valueShift]);

  const handleOnExport = () => {
    let wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataShow);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "Work_order.xlsx");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, m: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={5}>
            <Typography variant="h3" gutterBottom>
              TIT Export file Production History
            </Typography>
          </Grid>
          <Grid item xs={6} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start"
                value={valueStart}
                onChange={(newValue) => setValueStart(newValue)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End"
                value={valueEnd}
                onChange={(newValue) => setValueEnd(newValue)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} lg={1}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-name-label">Shift</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={valueShift}
                  label="All"
                  onChange={(e) => setValueShift(e.target.value)}
                >
                  <MenuItem value={"All"}>All</MenuItem>
                  <MenuItem value={"Day"}>Day</MenuItem>
                  <MenuItem value={"Night"}>Night</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6} lg={2}>
            <Button
              variant="contained"
              onClick={handleOnExport}
              color="success"
              sx={{ width: "100%", height: 55 }}
            >
              Export Excel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ p: 2, height: 650, width: "100%", display: "flow" }}>
        <DataGrid
          rows={dataShow}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          getRowId={(row: any) => row.PD_key}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[100]}
          //   checkboxSelection
          //   disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
