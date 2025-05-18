import { useEffect, useState } from "react";
import { fetchDailyCounts } from "@/services/counter";
import { CountItem } from "@/types/counter";
import { getHourData } from "@/utils/datetime";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

function DailyCounterPage() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [data, setData] = useState<CountItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { roomId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = date.format("YYYY-MM-DD");
        const response = await fetchDailyCounts(formattedDate);
        const { data: items } = response.data;
        setData(items);
        const total = items.reduce((sum, item) => sum + item.count, 0);
        setTotalCount(total);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [date]);

  const dataWithHour = getHourData(data);

  const hours = dataWithHour.map((d) => d.hour);
  const minHour = Math.min(...hours);
  const maxHour = Math.max(...hours);
  const displayMinHour = Math.min(minHour, 7);
  const displayMaxHour = Math.max(maxHour, 19);

  const filteredData = dataWithHour
    .filter((d) => d.hour >= displayMinHour && d.hour <= displayMaxHour)
    .sort((a, b) => a.hour - b.hour);

  // Determine max for peak highlight
  const maxCount = Math.max(...filteredData.map((d) => d.count));
  const enhancedData = filteredData.map((d) => ({
    ...d,
    fill: d.count === maxCount ? "#ff5722" : "#1976d2", // orange = peak
  }));

  // Format hour for display (24-hour)
  const formatHour = (hour: number) => `${hour}:00`;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
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
            <Typography variant="h6" gutterBottom sx={{ display: "block" }}>
              Total Count: {totalCount}
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={enhancedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickFormatter={formatHour}
                label={{
                  value: "Hour",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                label={{ value: "Count", angle: -90, position: "insideLeft" }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => `${value}`}
                labelFormatter={(label) => formatHour(label)}
              />
              <Bar dataKey="count" isAnimationActive={false}>
                {enhancedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

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
}

export default DailyCounterPage;
