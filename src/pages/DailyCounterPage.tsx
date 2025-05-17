import React, { useEffect, useState } from "react";
import getAxiosInstance from '@/services/axios';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

const axios = getAxiosInstance();

interface CountItem {
  hour: string;
  count: number;
}


function DailyCounterPage () {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [data, setData] = useState<CountItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const {roomId} = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = date.format("YYYY-MM-DD");
        const response = await axios.get<CountItem[]>(`Test Data/test/${formattedDate}`);
        const items = response.data;

        setData(items);
        console.log(response);
        const total = items.reduce((sum, item) => sum + item.count, 0);
        setTotalCount(total);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [date,]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          People Counter
        </Typography>

        <DatePicker
          label="Select Date"
          value={date}
          onChange={(newDate) => newDate && setDate(newDate)}
          disableFuture
          sx={{ mb: 3 }}
        />

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">
              Total Count: {totalCount}
            </Typography>
          </CardContent>
        </Card>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottomRight", offset: -5 }} />
            <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate(`/monthly/${roomId}`)}
        >
          Go to Monthly View
        </Button>
      </Container>
    </LocalizationProvider>
  );
};

export default DailyCounterPage;
