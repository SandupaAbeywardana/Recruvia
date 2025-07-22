import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import CustomHead from "@/utils/customHead";

import authAPIs from "@/api/authAPIs";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const toastId = toast.loading("Logging in...", {
        autoClose: false,
      });
      const res = await authAPIs.login({ email, password });

      Cookies.set("token", res.data.data.token);
      router.push("/");
      toast.update(toastId, {
        render: "Login successful",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <>
      <CustomHead title="Login" />
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
              <Image
                src="/assets/images/logo/LogoNoBG.png"
                alt="Recruvia Logo"
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "auto",
                  marginBottom: "2rem",
                  marginTop: "2rem",
                }}
              />
              <Typography variant="h5" gutterBottom>
                Welcome to Recruvia 👋
              </Typography>
              <Typography variant="body1" gutterBottom>
                Please login to continue your journey with us.
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <form onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  fullWidth
                  size="small"
                  type={viewPassword ? "text" : "password"}
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  Login
                </Button>
              </form>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  passHref
                  style={{ textDecoration: "none" }}
                >
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
                    Register here
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
