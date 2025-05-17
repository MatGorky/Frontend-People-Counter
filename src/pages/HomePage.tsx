import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box
} from "@mui/material";

interface Room {
  id: string;
  name: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      // TODO: Replace with real API call
      // const response = await axios.get<Room[]>('/api/user/rooms');
      // const userRooms = response.data;

      const mockRooms: Room[] = [
        { id: "1", name: "Biblioteca NCE" }
      ];

      setRooms(mockRooms);
      setLoading(false);

      if (mockRooms.length === 1) {
        navigate(`/daily/${mockRooms[0].id}`);
      }
    };

    fetchRooms();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">No accessible rooms found.</Typography>
      </Container>
    );
  }

  // Future logic for multiple rooms
  /*
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Select a Room
      </Typography>
      <Card>
        <CardContent>
          <List>
            {rooms.map((room) => (
              <ListItem key={room.id} disablePadding>
                <ListItemButton onClick={() => navigate(`/room/${room.id}`)}>
                  <ListItemText primary={room.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
  */

  // Single room redirect already triggered, return null
  return null;
};

export default HomePage;
