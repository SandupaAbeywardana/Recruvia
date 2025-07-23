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

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMyJobs = async () => {
    try {
      const res = await apiPrivate.get("/jobs/my");
      setJobs(res.data.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const renderJobContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" mt={20}>
          <CircularProgress />
        </Box>
      );
    }

    if (jobs.length === 0) {
      return (
        <Typography variant="h6" align="center" color="text.secondary" mt={20}>
          You haven&apos;t posted any jobs yet.
        </Typography>
      );
    }

    return (
      <Grid container spacing={3}>
        {jobs.map((job) => (
          // @ts-expect-error TS2322
          <Grid item size={{ xs: 12, sm: 4, md: 4 }} key={job.id}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: 1,
                borderRadius: 2,
                padding: 1,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    color={job.status ? "success" : "error"}
                    label={job.status ? "Active" : "Inactive"}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {job.description.replace(/<[^>]+>/g, "").slice(0, 80)}...
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                <Chip
                  label={`Posted on ${new Date(
                    job.created_at
                  ).toLocaleDateString()}`}
                  size="small"
                  color="default"
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      router.push(
                        `/employer/job-posts/${job.id}/view-applicants`
                      )
                    }
                  >
                    <PeopleAltIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      router.push(`/employer/job-posts/${job.id}/view`)
                    }
                  >
                    <Icon icon="majesticons:open" fontSize={20} />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

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
                Manage your job postings and applicants here.
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/employer/job-posts/create-new")}
            >
              Create Job Post
            </Button>
            <Button variant="outlined" color="error" onClick={logout}>
              Logout
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {renderJobContent()}
      </Container>
    </>
  );
}
