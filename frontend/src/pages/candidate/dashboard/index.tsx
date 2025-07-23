import { apiPrivate } from "@/api/apiBase";
import { useAuth } from "@/context/AuthContext";
import CustomHead from "@/utils/CustomHead";
import { Icon } from "@iconify/react";
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
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const debouncedSearch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchTerm(value);
      }, 300);
    };
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await apiPrivate.get("/jobs/search", {
          params: { keyword: searchTerm },
        });
        setJobs(response.data.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm]);

  return (
    <>
      <CustomHead title="Candidate Dashboard" />
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
                Your Path to Your Dream Job Starts Here
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/candidate/my-applications")}
            >
              My Applications
            </Button>
            <Button variant="outlined" color="error" onClick={logout}>
              Logout
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item size={{ xs: 12, sm: 8 }}>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Search for jobs..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="material-symbols:search" fontSize={20} />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : jobs.length === 0 ? (
          <Typography>No jobs found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid
                item
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
                key={job.id}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 1,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minHeight: 60 }}
                    >
                      {job.description.replace(/<[^>]+>/g, "").slice(0, 100)}...
                    </Typography>
                    <Box mt={2}>
                      <Chip
                        label={`Posted on ${new Date(
                          job.created_at
                        ).toLocaleDateString()}`}
                        size="small"
                        color="default"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                    <Button
                      size="small"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
