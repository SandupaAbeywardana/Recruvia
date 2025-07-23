import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import authAPIs from "@/api/authAPIs";
import CustomHead from "@/utils/CustomHead";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function RegisterPage() {
  const [role, setRole] = useState<"employer" | "candidate">("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || (role === "employer" && !company)) {
      setError("Please fill in all fields.");
      return;
    }

    //validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    //validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    try {
      interface RegisterPayload {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role: "employer" | "candidate";
        company_name?: string;
      }

      const payload: RegisterPayload = {
        name,
        email,
        password,
        password_confirmation: password,
        role,
        ...(role === "employer" && { company_name: company }),
      };

      const res = await authAPIs.register(payload);
      Cookies.set("token", res.data.data.token);
      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <>
      <CustomHead title="Register" />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 500,
                padding: 4,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/assets/images/logo/LogoNoBG.png"
                  alt="Recruvia Logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: "75%",
                    height: "auto",
                    marginBottom: "2rem",
                    marginTop: "2rem",
                  }}
                />
              </Box>
              <Typography variant="h5" gutterBottom>
                Welcome to Recruvia 👋
              </Typography>
              <Typography variant="body1" gutterBottom>
                Please fill in the details below to create your account.
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <form onSubmit={handleSubmit}>
                <ToggleButtonGroup
                  size="small"
                  value={role}
                  exclusive
                  onChange={(_, val) => val && setRole(val)}
                  fullWidth
                  sx={{ my: 2 }}
                >
                  <ToggleButton value="candidate">Candidate</ToggleButton>
                  <ToggleButton value="employer">Employer</ToggleButton>
                </ToggleButtonGroup>
                <TextField
                  label="Full Name"
                  fullWidth
                  size="small"
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {role === "employer" && (
                  <TextField
                    label="Company Name"
                    fullWidth
                    size="small"
                    margin="normal"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                )}
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type={viewPassword ? "text" : "password"}
                  fullWidth
                  size="small"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <Icon
                          icon={viewPassword ? "mdi:eye" : "mdi:eye-off"}
                          fontSize={22}
                          onClick={() => setViewPassword(!viewPassword)}
                          style={{ cursor: "pointer" }}
                        />
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Register
                </Button>
              </form>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link href="/login" passHref style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    component="span"
                    color="primary"
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Login here
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
