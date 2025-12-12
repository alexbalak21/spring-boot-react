import { useState } from "react";
import axios from "axios";
import { useCsrf } from "../hooks/useCsrf";
import Button from "../components/Button";
import Input from "../components/Input";

const REGISTER_URL = "/api/auth/register";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  useCsrf();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [registerResult, setRegisterResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegisterResult(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill out all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(REGISTER_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true, // keep cookies (CSRF/session)
      });

      setRegisterResult(response.data?.message || "Registration successful");
      console.log("Registration successful:", response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">sign in to an existing account</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {registerResult && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{registerResult}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              label="Full name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              fullWidth
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
