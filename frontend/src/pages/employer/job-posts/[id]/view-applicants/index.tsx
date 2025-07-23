import { apiPrivate } from "@/api/apiBase";
import { useAuth } from "@/context/AuthContext";
import CustomHead from "@/utils/CustomHead";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ViewApplicants = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [jobRes, applicantsRes] = await Promise.all([
          apiPrivate.get(`/jobs/${id}`),
          apiPrivate.get(`/jobs/${id}/applications`),
        ]);

        setJobPost(jobRes.data.data);
        setApplicants(applicantsRes.data.data);
      } catch (error) {
        console.error("Error fetching job post or applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" mt={20}>
          <CircularProgress />
        </Box>
      );
    }

    if (applicants.length > 0) {
      return (
        <Box>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">
              Applicants for: {jobPost?.title}
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Applicants: {applicants.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Job Post Created on:{" "}
                {new Date(jobPost?.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Applied On</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      {applicant.first_name} {applicant.last_name}
                    </TableCell>
                    <TableCell>{applicant.email}</TableCell>

                    <TableCell>
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          router.push(
                            `/employer/job-posts/${id}/view-applicants/${applicant.id}`
                          )
                        }
                      >
                        <Icon icon="majesticons:open" fontSize={24} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "25vh",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No applicants found for this job post.
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <CustomHead title="Edit Job Post" />
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
              variant="outlined"
              color="primary"
              onClick={() => router.push("/employer/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {renderContent()}
      </Container>
    </>
  );
};

export default ViewApplicants;
