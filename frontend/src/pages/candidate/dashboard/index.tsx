import { apiPrivate } from "@/api/apiBase";
import { useAuth } from "@/context/AuthContext";
import CustomHead from "@/utils/CustomHead";
import { Icon } from "@iconify/react";
import PeopleAltIcon from "@mui/icons-material/People";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Job = {
  id: number;
  title: string;
  status: boolean;
  description: string;
  created_at: string;
};

export default function CandidateDashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  return (
    <>
      <CustomHead title="Employer Dashboard" />
      <Container maxWidth="lg">
        <Box
          mt={4}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Image
              src="/assets/images/logo/LogoNoBG.png"
              alt="Recruvia Logo"
              width={220}
              height={100}
            />
            <Box>
              <Typography variant="h4" fontWeight={600}>
                Hi, {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your Pa
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/candidate/my-applications")}
            >
              My Applicantions
            </Button>
            <Button variant="outlined" color="error" onClick={logout}>
              Logout
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />
      </Container>
    </>
  );
}
