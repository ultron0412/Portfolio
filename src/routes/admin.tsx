import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { cv, type Portfolio } from "@/lib/cv";
import {
  createPortfolio,
  deleteSectionItem,
  fetchPortfolio,
  updatePortfolio,
  uploadAsset,
} from "@/services/portfolioApi";

type LoginFormInput = {
  email: string;
  password: string;
};

type DeleteItemInput = {
  section: "experience" | "projects" | "education" | "certifications";
  itemId: string;
};

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { token, user, isLoading, login, logout } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio>(cv);
  const [portfolioText, setPortfolioText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loginForm = useForm<LoginFormInput>({
    defaultValues: { email: "admin@ayush.dev", password: "" },
  });
  const deleteForm = useForm<DeleteItemInput>({
    defaultValues: { section: "projects", itemId: "" },
  });

  useEffect(() => {
    fetchPortfolio()
      .then((data) => {
        setPortfolio(data);
        setPortfolioText(JSON.stringify(data, null, 2));
      })
      .catch(() => {
        setPortfolio(cv);
        setPortfolioText(JSON.stringify(cv, null, 2));
      });
  }, []);

  const previewData = useMemo(() => {
    try {
      return JSON.parse(portfolioText) as Portfolio;
    } catch {
      return portfolio;
    }
  }, [portfolio, portfolioText]);

  const submitLogin = loginForm.handleSubmit(async (values) => {
    setStatusMessage("");
    try {
      await login(values);
      setStatusMessage("Login successful.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Login failed.");
    }
  });

  const savePortfolio = async () => {
    if (!token) return;

    setStatusMessage("");
    setIsSaving(true);

    try {
      const parsed = JSON.parse(portfolioText) as Portfolio;
      const saved = parsed._id
        ? await updatePortfolio(parsed._id, parsed, token)
        : await createPortfolio(parsed, token);

      setPortfolio(saved);
      setPortfolioText(JSON.stringify(saved, null, 2));
      setStatusMessage("Portfolio saved.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !event.target.files?.[0]) return;
    setStatusMessage("");
    setIsUploading(true);

    try {
      const uploaded = await uploadAsset(event.target.files[0], token);
      const updated = {
        ...portfolio,
        personal: {
          ...portfolio.personal,
          resumeUrl: uploaded.url,
        },
      };
      setPortfolio(updated);
      setPortfolioText(JSON.stringify(updated, null, 2));
      setStatusMessage("Resume uploaded. Save portfolio to persist.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeItem = deleteForm.handleSubmit(async (values) => {
    if (!token || !portfolio._id) {
      setStatusMessage("Portfolio id not found. Save portfolio first.");
      return;
    }
    setStatusMessage("");
    try {
      const updated = await deleteSectionItem(portfolio._id, values.section, values.itemId, token);
      setPortfolio(updated);
      setPortfolioText(JSON.stringify(updated, null, 2));
      setStatusMessage("Item deleted.");
      deleteForm.reset({ section: values.section, itemId: "" });
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Delete failed.");
    }
  });

  if (!token || !user) {
    return (
      <section className="section-card admin-panel">
        <h2>Admin Login</h2>
        <form onSubmit={submitLogin} className="auth-form">
          <label>
            Email
            <input type="email" {...loginForm.register("email", { required: true })} />
          </label>
          <label>
            Password
            <input
              type="password"
              {...loginForm.register("password", { required: true, minLength: 8 })}
            />
          </label>
          <button type="submit" disabled={loginForm.formState.isSubmitting || isLoading}>
            {loginForm.formState.isSubmitting || isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
        {statusMessage ? <p className="status error">{statusMessage}</p> : null}
      </section>
    );
  }

  return (
    <section className="section-card admin-panel">
      <div className="admin-head">
        <h2>Admin Panel</h2>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
      <p className="muted-note">Signed in as {user.email}</p>

      <div className="admin-actions">
        <label className="upload-button">
          {isUploading ? "Uploading..." : "Upload Resume or Project Asset"}
          <input
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={uploadResume}
            hidden
          />
        </label>
        <button type="button" onClick={savePortfolio} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Portfolio"}
        </button>
      </div>

      <form onSubmit={removeItem} className="delete-form">
        <h3>Delete Section Item</h3>
        <label>
          Section
          <select {...deleteForm.register("section")}>
            <option value="experience">Experience</option>
            <option value="projects">Projects</option>
            <option value="education">Education</option>
            <option value="certifications">Certifications</option>
          </select>
        </label>
        <label>
          Item ID
          <input
            placeholder="Mongo item _id"
            {...deleteForm.register("itemId", { required: true })}
          />
        </label>
        <button type="submit">Delete Item</button>
      </form>

      <label className="json-editor">
        Portfolio JSON
        <textarea
          value={portfolioText}
          onChange={(event) => setPortfolioText(event.target.value)}
          rows={24}
          spellCheck={false}
        />
      </label>

      <div className="preview-box">
        <h3>Preview</h3>
        <p>
          {previewData.personal.name} - {previewData.personal.title}
        </p>
        <p>{previewData.summary}</p>
      </div>

      {statusMessage ? <p className="status success">{statusMessage}</p> : null}
    </section>
  );
}
