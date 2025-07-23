import { apiPrivate } from "@/api/apiBase";
import { useAuth } from "@/context/AuthContext";
import CustomHead from "@/utils/CustomHead";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ViewJobPost() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchJobPost = async () => {
        try {
          setLoading(true);
          const response = await apiPrivate.get(`/jobs/${id}`);
          setJobPost(response.data.data);
          setFields(response.data.data.application_fields || []);
        } catch (error) {
          console.error("Error fetching job post:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobPost();
    }
  }, [id]);

  return (
    <>
      <CustomHead title="View Job Post" />
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

        {loading ? (
          <Box display="flex" justifyContent="center" mt={20}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                flexWrap: "wrap",
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                View Job Post
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push(`/employer/job-posts/${id}/edit`)}
              >
                Edit Job Post
              </Button>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Job Details
            </Typography>
            <Box mb={4}>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Title</strong>
                      </TableCell>
                      <TableCell>{jobPost.title}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell>{jobPost.category?.name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell>{jobPost.type?.name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Location</strong>
                      </TableCell>
                      <TableCell>{jobPost.location?.name || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Location Type</strong>
                      </TableCell>
                      <TableCell>
                        {jobPost.location_type?.name || "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
                dangerouslySetInnerHTML={{ __html: jobPost.description }}
              ></Box>
            </Box>

            <Box mt={4} mb={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Custom Fields
                </Typography>
              </Box>
              <TableContainer sx={{ mt: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Field</TableCell>
                      <TableCell>Field Type</TableCell>
                      <TableCell>Required</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ py: 3 }}
                          >
                            No custom fields defined for this job post.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ py: 2 }}>
                            <Typography>Name: {field.field_name}</Typography>
                            {field.field_description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                Description: {field.field_description}
                              </Typography>
                            )}
                            {field.field_type === "select" &&
                              field.options?.length > 0 && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  Options: {field.options.join(", ")}
                                </Typography>
                              )}
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {field.field_type.toString().toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {field.is_required ? "Yes" : "No"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Container>
    </>
  );
}
