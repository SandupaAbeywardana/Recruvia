import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Paper,
  Divider,
  Stack,
  Autocomplete,
  createFilterOptions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { apiPrivate } from "@/api/apiBase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomHead from "@/utils/CustomHead";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";

const ReactJordit = dynamic(() => import("jodit-react"), { ssr: false });

export default function CreateJobPostPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [locationId, setLocationId] = useState("");
  const [locationTypeId, setLocationTypeId] = useState("");

  const [fields, setFields] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [locationTypes, setLocationTypes] = useState<any[]>([]);

  const filter = createFilterOptions<any>();

  const fetchMeta = async () => {
    setLoading(true);
    const [cat, typ, loc, locType] = await Promise.all([
      apiPrivate.get("/job-categories"),
      apiPrivate.get("/job-types"),
      apiPrivate.get("/job-locations"),
      apiPrivate.get("/job-location-types"),
    ]);
    setLoading(false);
    setCategories(cat.data.data);
    setTypes(typ.data.data);
    setLocations(loc.data.data);
    setLocationTypes(locType.data.data);
  };

  useEffect(() => {
    fetchMeta();
  }, [refresh]);

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        field_name: "",
        field_type: "text",
        is_required: false,
        order: prev.length + 1,
        description: "",
        options: [],
      },
    ]);
  };

  const updateField = (index: number, key: string, value: any) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const removeField = (index: number) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated.map((f, i) => ({ ...f, order: i + 1 })));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!title.trim()) {
      toast.error("Job title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Job description is required");
      return;
    }

    if (!categoryId) {
      toast.error("Job category is required");
      return;
    }

    if (!typeId) {
      toast.error("Job type is required");
      return;
    }

    if (!locationId) {
      toast.error("Job location is required");
      return;
    }

    if (!locationTypeId) {
      toast.error("Location type is required");
      return;
    }

    // Validate custom fields
    for (const field of fields) {
      if (!field.field_name.trim()) {
        toast.error("Custom field name is required");
        return;
      }
      if (field.is_required && !field.field_type) {
        toast.error(`Field type is required for ${field.field_name}`);
        return;
      }
      if (
        field.field_type === "select" &&
        (!field.options || field.options.length === 0)
      ) {
        toast.error(
          `Options are required for select field ${field.field_name}`
        );
        return;
      }
    }

    // Prepare payload
    const payload = {
      title,
      description,
      category_id: Number(categoryId.id),
      type_id: Number(typeId),
      location_id: Number(locationId.id),
      location_type_id: Number(locationTypeId),
      fields: fields.map((field) => ({
        field_name: field.field_name,
        field_type: field.field_type,
        is_required: field.is_required,
        status: true,
        description: field.description || "",
        order: field.order,
        ...(field.field_type === "select" && { options: field.options }),
      })),
    };

    Swal.fire({
      title: "Confirm Job Post",
      text: "Are you sure you want to create this job post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading("Creating job post...", {
          autoClose: false,
        });

        try {
          await apiPrivate.post("/jobs", payload);
          toast.update(toastId, {
            render: "Job post created successfully!",
            type: "success",
            autoClose: 3000,
            isLoading: false,
          });

          router.push("/employer/dashboard");
        } catch (err) {
          console.error("Error creating job post:", err);
          toast.update(toastId, {
            render: "Failed to create job post",
            type: "error",
            autoClose: 3000,
            isLoading: false,
          });
        }
      }
    });
  };

  const buttons = [
    "bold",
    "italic",
    "underline",
    "|",
    "ul",
    "ol",
    "link",
    "image",
    "|",
    "source",
    "preview",
  ];

  const config = {
    readonly: false,
    placeholder: "Type your job description here...",
    buttons,
    uploader: {
      insertImageAsBase64URI: true,
    },
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
              variant="outlined"
              color="primary"
              onClick={() => router.push("/employer/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            flexWrap: "wrap",
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Create Job Post
          </Typography>
          <Button variant="contained" onClick={handleSubmit}>
            Publish Job
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ my: 3 }}>
          <Grid item size={{ xs: 12 }}>
            <TextField
              required
              size="small"
              label="Job Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              size="small"
              value={
                typeof categoryId === "object"
                  ? categoryId
                  : categories.find((c) => c.id === categoryId) || null
              }
              onChange={async (event, newValue) => {
                if (typeof newValue === "string") {
                  const res = await apiPrivate.post("/job-categories", {
                    name: newValue,
                  });
                  if (res.data.data) {
                    setCategoryId(res.data.data);
                    setRefresh(!refresh);
                  } else {
                    toast.error("Failed to create category");
                  }
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  const res = await apiPrivate.post("/job-categories", {
                    name: newValue.inputValue,
                  });
                  if (res.data.data) {
                    setCategoryId(res.data.data);
                    setRefresh(!refresh);
                  } else {
                    toast.error("Failed to create category");
                  }
                } else {
                  setCategoryId(newValue); // selected existing category
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const inputValue = params.inputValue.trim();
                const isExisting = options.some(
                  (option) => option.name === inputValue
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `Add "${inputValue}"`,
                  });
                }
                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={categories}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                if (option.inputValue) return option.inputValue;
                return option.name;
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.inputValue || option.id}>
                  {option.name}
                </li>
              )}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Job Category"
                  fullWidth
                  required
                />
              )}
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              size="small"
              select
              label="Job Type"
              fullWidth
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              required
            >
              {loading ? (
                <MenuItem value="" disabled>
                  Loading types...
                </MenuItem>
              ) : (
                types.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              size="small"
              value={
                typeof locationId === "object"
                  ? locationId
                  : locations.find((l) => l.id === locationId) || null
              }
              onChange={async (event, newValue) => {
                if (typeof newValue === "string") {
                  const res = await apiPrivate.post("/job-locations", {
                    name: newValue,
                  });
                  if (res.data.data) {
                    setLocationId(res.data.data);
                    setRefresh(!refresh);
                  } else {
                    toast.error("Failed to create location");
                  }
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  const res = await apiPrivate.post("/job-locations", {
                    name: newValue.inputValue,
                  });
                  if (res.data.data) {
                    setLocationId(res.data.data);
                    setRefresh(!refresh);
                  } else {
                    toast.error("Failed to create location");
                  }
                } else {
                  setLocationId(newValue); // selected existing location
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const inputValue = params.inputValue.trim();
                const isExisting = options.some(
                  (option) => option.name === inputValue
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `Add "${inputValue}"`,
                  });
                }
                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={locations}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                if (option.inputValue) return option.inputValue;
                return option.name;
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.inputValue || option.id}>
                  {option.name}
                </li>
              )}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Job Location"
                  fullWidth
                  required
                />
              )}
              loading={loading}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              size="small"
              select
              label="Location Type"
              fullWidth
              value={locationTypeId}
              onChange={(e) => setLocationTypeId(e.target.value)}
              required
            >
              {loading ? (
                <MenuItem value="" disabled>
                  Loading location types...
                </MenuItem>
              ) : (
                locationTypes.map((lt) => (
                  <MenuItem key={lt.id} value={lt.id}>
                    {lt.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>
        </Grid>

        <ReactJordit
          value={description}
          config={config}
          onBlur={(val) => setDescription(val)}
        />

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
            <Button variant="outlined" onClick={addField}>
              + Add Field
            </Button>
          </Box>
          <TableContainer sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {fields.length > 1 && <TableCell></TableCell>}
                  <TableCell>Field</TableCell>
                  <TableCell>Field Type</TableCell>
                  <TableCell>Required</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 3 }}
                      >
                        No custom fields added yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, i) => (
                    <TableRow key={i}>
                      {fields.length > 1 && (
                        <TableCell>
                          <Box display="flex">
                            {i !== 0 && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (i > 0) {
                                    const updated = [...fields];
                                    [updated[i - 1], updated[i]] = [
                                      updated[i],
                                      updated[i - 1],
                                    ];
                                    setFields(
                                      updated.map((f, idx) => ({
                                        ...f,
                                        order: idx + 1,
                                      }))
                                    );
                                  }
                                }}
                              >
                                <Icon icon="line-md:arrow-up" fontSize={20} />
                              </IconButton>
                            )}
                            {i !== fields.length - 1 && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (i < fields.length - 1) {
                                    const updated = [...fields];
                                    [updated[i], updated[i + 1]] = [
                                      updated[i + 1],
                                      updated[i],
                                    ];
                                    setFields(
                                      updated.map((f, idx) => ({
                                        ...f,
                                        order: idx + 1,
                                      }))
                                    );
                                  }
                                }}
                              >
                                <Icon icon="line-md:arrow-down" fontSize={20} />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          py: 2,
                        }}
                      >
                        <TextField
                          size="small"
                          fullWidth
                          label="Name"
                          value={field.field_name}
                          onChange={(e) =>
                            updateField(i, "field_name", e.target.value)
                          }
                          required
                        />
                        <TextField
                          size="small"
                          fullWidth
                          label="Description"
                          value={field.description || ""}
                          onChange={(e) =>
                            updateField(i, "description", e.target.value)
                          }
                          sx={{ mt: 1 }}
                        />
                        {field.field_type === "select" && (
                          <TextField
                            size="small"
                            fullWidth
                            label="Options (comma-separated)"
                            value={field.options?.join(", ") || ""}
                            onChange={(e) =>
                              updateField(
                                i,
                                "options",
                                e.target.value.split(",").map((v) => v.trim())
                              )
                            }
                            sx={{ mt: 1 }}
                            required
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          select
                          fullWidth
                          value={field.field_type}
                          onChange={(e) =>
                            updateField(i, "field_type", e.target.value)
                          }
                        >
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                          <MenuItem value="file">File</MenuItem>
                          <MenuItem value="select">Select</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={field.is_required}
                          onChange={(e) =>
                            updateField(i, "is_required", e.target.checked)
                          }
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => removeField(i)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}
