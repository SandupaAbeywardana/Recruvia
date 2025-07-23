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

const ViewApplicantion = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [applicant, setApplicant] = useState([]);
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id, applicantID } = router.query;

  useEffect(() => {
    if (!id || !applicantID) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [jobRes, applicantRes] = await Promise.all([
          apiPrivate.get(`/jobs/${id}`),
          apiPrivate.get(`/jobs/${id}/applications`),
        ]);

        const applicantData = applicantRes.data.data.find(
          (app) => app.id == applicantID
        );

        setJobPost(jobRes.data.data);
        setApplicant(applicantData);
      } catch (error) {
        console.error("Error fetching job post or applicant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicantID, id]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" mt={20}>
          <CircularProgress />
        </Box>
      );
    }

    if (applicant) {
      return (
        <Box>
          <Typography variant="h6" mt={4} mb={2}>
            Applicant Details
          </Typography>

          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Applicant Name:</strong>
                  </TableCell>
                  <TableCell>
                    {applicant?.first_name} {applicant?.last_name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Email:</strong>
                  </TableCell>
                  <TableCell>{applicant?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Phone:</strong>
                  </TableCell>
                  <TableCell>{applicant?.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Applied On:</strong>
                  </TableCell>
                  <TableCell>
                    {new Date(applicant?.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Resume:</strong>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${applicant.resume_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1976d2", textDecoration: "underline" }}
                    >
                      View Resume
                    </a>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" mt={4} mb={2}>
            Additional Information
          </Typography>

          <TableContainer>
            <Table>
              <TableBody>
                {applicant?.answers?.map((answer, index) =>
                  answer.field.field_type !== "file" ? (
                    <TableRow key={index}>
                      <TableCell>{answer.field.field_name}</TableCell>
                      <TableCell>{answer.value}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index}>
                      <TableCell>{answer.field.field_name}</TableCell>
                      <TableCell>
                        <a
                          href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${answer.value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                          }}
                        >
                          View File
                        </a>
                      </TableCell>
                    </TableRow>
                  )
                )}
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
          No applicant data available.
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

export default ViewApplicantion;
