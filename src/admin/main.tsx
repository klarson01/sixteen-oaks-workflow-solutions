import { homepageFor, homepageFieldGroups, type HomepageContent } from "../content/homepage";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  login,
  logout,
  getUser,
  handleAuthCallback,
  acceptInvite,
  updateUser,
  requestPasswordRecovery,
} from "@netlify/identity";
import type {
  Project,
  ProjectImage,
  SiteContent,
  Inquiry,
  MailSettings,
} from "../content/model";
import "./style.css";
import { invitationFragment } from "./invitation";
async function api(path: string, method = "GET", data?: unknown) {
  const response = await fetch("/api/admin/" + path, {
    method,
    credentials: "same-origin",
    headers: data instanceof File ? {} : { "Content-Type": "application/json" },
    body:
      data instanceof File
        ? data
        : data === undefined
          ? undefined
          : JSON.stringify(data),
  });
  const raw = await response.text();
  let result;
  try {
    result = JSON.parse(raw);
  } catch {
    result = { message: raw };
  }
  if (!response.ok) throw new Error(result.message || "The request failed.");
  return result;
}
const blankImage = (): ProjectImage => ({
  src: "",
  alt: "",
  caption: "",
  width: 1,
  height: 1,
});
const blankProject = (): Project => ({
  id: "project-" + crypto.randomUUID(),
  slug: "project-" + Date.now(),
  title: "New project",
  tagline: "",
  summary: "",
  business: "",
  location: "",
  category: "Custom business website",
  website: "",
  status: "draft",
  order: 10,
  cover: blankImage(),
  gallery: [],
  needTitle: "The need",
  need: "",
  buildTitle: "What we built",
  build: "",
  experienceTitle: "The experience",
  experience: "",
  delivered: [],
});
type MailForm = MailSettings & {
  passwordConfigured: boolean;
  etag: string;
  encryptionReady?: boolean;
};
function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label>
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          required={required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
        />
      )}
    </label>
  );
}
function ImageEditor({
  value,
  onChange,
  run,
  showCaption = true,
}: {
  showCaption?: boolean;
  value: ProjectImage;
  onChange: (v: ProjectImage) => void;
  run: (fn: () => Promise<void>) => void;
}) {
  return (
    <div className="image-editor">
      {value.src && (
        <img src={value.src} alt={value.alt || "Project preview"} />
      )}
      <label>
        Upload image · JPG, PNG, WebP · up to 2 MB
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            run(async () => {
              if (file.size > 2000000)
                throw new Error("Choose an image smaller than 2 MB.");
              const bitmap = await createImageBitmap(file);
              const size = { width: bitmap.width, height: bitmap.height };
              bitmap.close();
              if (size.width > 16000 || size.height > 16000)
                throw new Error("Image dimensions are too large.");
              const result = await api("upload", "POST", file);
              onChange({ ...value, ...size, src: result.src });
            });
            e.target.value = "";
          }}
        />
      </label>
      <Field
        label="Image description (for accessibility)"
        value={value.alt}
        onChange={(alt) => onChange({ ...value, alt })}
      />
      {showCaption && <Field
        label="Caption (optional)"
        multiline
        value={value.caption}
        onChange={(caption) => onChange({ ...value, caption })}
      />}
    </div>
  );
}
function Admin() {
  const [signedIn, setSignedIn] = useState(false),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [invite, setInvite] = useState(""),
    [invitationLink, setInvitationLink] = useState(""),
    [recovery, setRecovery] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null),
    [etag, setEtag] = useState(""),
    [preview, setPreview] = useState(false),
    [dirty, setDirty] = useState(false),
    [mailDirty, setMailDirty] = useState(false),
    [mail, setMail] = useState<MailForm | null>(null),
    [inbox, setInbox] = useState<Inquiry[]>([]),
    [tab, setTab] = useState("homepage"),
    [selected, setSelected] = useState(""),
    [savedIds, setSavedIds] = useState<string[]>([]);
  async function load() {
    const data = await api("content");
    setContent({ ...data.content, homepage: structuredClone(homepageFor(data.content)) });
    setEtag(data.etag);
    setPreview(data.preview);
    setSavedIds(data.content.projects.map((p: Project) => p.id));
    setDirty(false);
    setMail(await api("mail"));
    setMailDirty(false);
    setSignedIn(true);
  }
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }
  async function finishCallback() {
    const callback = await handleAuthCallback();
    if (callback?.type === "invite") {
      setSignedIn(false);
      setInvite(callback.token ?? "");
      setRecovery(false);
      return;
    }
    if (callback?.type === "recovery") {
      setSignedIn(false);
      setRecovery(true);
      setInvite("");
      return;
    }
    if (await getUser()) await load();
  }
  useEffect(() => {
    void run(async () => {
      try {
        await finishCallback();
      } finally {
        setLoading(false);
      }
    });
  }, []);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty || mailDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, mailDirty]);
  function edit(next: SiteContent) {
    setContent(next);
    setDirty(true);
  }
  async function saveContent() {
    if (!content) return;
    const result = await api("content", "PUT", { content, etag });
    setContent(result.content);
    setEtag(result.etag);
    setSavedIds(result.content.projects.map((p: Project) => p.id));
    setDirty(false);
    const savedProject = result.content.projects.find(
      (p: Project) => p.id === selected,
    );
    setMessage(
      tab === "homepage"
        ? `Homepage saved. Open View website to see your changes on this ${preview ? "preview" : "live"} site.`
        : savedProject?.status === "draft"
        ? `Saved “${savedProject.title}” as a draft. Choose Published and save when it is ready to appear in Our work.`
        : `Saved. Published projects are visible on the ${preview ? "preview" : "live"} Our work page.`,
    );
  }
  const project = content?.projects.find((p) => p.id === selected);
  function patchProject(patch: Partial<Project>) {
    if (!content || !project) return;
    const next = { ...project, ...patch };
    const settings = { ...content.settings };
    if (next.status === "draft" && settings.featuredProjectId === next.id)
      settings.featuredProjectId = "";
    edit({
      ...content,
      settings,
      projects: content.projects.map((p) => (p.id === next.id ? next : p)),
    });
  }
  const homepage = content ? homepageFor(content) : null;
  function patchHomepage(patch: Partial<HomepageContent>) {
    if (content && homepage) edit({ ...content, homepage: { ...homepage, ...patch } });
  }
  function mailPatch(patch: Partial<MailForm>) {
    if (mail) {
      setMail({ ...mail, ...patch });
      setMailDirty(true);
    }
  }
  const saveControls = (
    <div className="save-bar">
      <span>
        {dirty
          ? "Unsaved website changes"
          : mailDirty
            ? "Unsaved email connection"
            : "All website changes saved"}
      </span>
      <button
        disabled={busy || !dirty}
        className="primary"
        onClick={() => void run(saveContent)}
      >
        Save website changes
      </button>
      <button
        disabled={busy}
        onClick={() => {
          if (
            (dirty || mailDirty) &&
            !confirm("Discard unsaved changes and reload?")
          )
            return;
          void run(async () => {
            await load();
            setMessage("Loaded the latest saved settings.");
          });
        }}
      >
        Reload saved settings
      </button>
    </div>
  );
  return (
    <>
      <header>
        <a href="/" className="brand">
          Sixteen Oaks <small>Website admin</small>
        </a>
        {signedIn && (
          <button
            disabled={busy}
            onClick={() => {
              if (
                (dirty || mailDirty) &&
                !confirm("Discard unsaved changes and sign out?")
              )
                return;
              void run(async () => {
                await logout();
                setSignedIn(false);
                setContent(null);
                setMail(null);
                setInbox([]);
                setDirty(false);
                setMailDirty(false);
              });
            }}
          >
            Sign out
          </button>
        )}
      </header>
      <main>
        <div className="notice" role="status" aria-live="polite">
          {busy ? "Working…" : message}
        </div>
        {loading ? (
          <p>Loading your admin…</p>
        ) : !signedIn ? (
          <section className="login panel">
            <p className="eyebrow">Private workspace</p>
            <h1>
              {invite
                ? "Set your password"
                : recovery
                  ? "Reset your password"
                  : "Welcome back."}
            </h1>
            <p>Manage your homepage, projects, contact details, and inquiries in one place.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  if (invite) {
                    await acceptInvite(invite, password);
                    setInvite("");
                  } else if (recovery) {
                    await updateUser({ password });
                    setRecovery(false);
                  } else await login(email, password);
                  setPassword("");
                  await load();
                });
              }}
            >
              {!invite && !recovery && (
                <Field
                  label="Admin email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  required
                />
              )}
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    invite || recovery ? "new-password" : "current-password"
                  }
                  minLength={invite || recovery ? 12 : 1}
                  required
                />
              </label>
              <button className="primary" disabled={busy}>
                {invite || recovery ? "Save password" : "Sign in"}
              </button>
            </form>
            {!invite && !recovery && (
              <details className="invite-help">
                <summary>Invitation opened the regular website?</summary>
                <p>
                  Open your invitation or password reset here to finish setting
                  your password.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void run(async () => {
                      const fragment = invitationFragment(
                        invitationLink,
                        location.origin,
                      );
                      setInvitationLink("");
                      history.replaceState(
                        null,
                        "",
                        location.pathname + fragment,
                      );
                      await finishCallback();
                    });
                  }}
                >
                  <label>
                    Invitation or password reset link
                    <input
                      type="password"
                      autoComplete="off"
                      value={invitationLink}
                      onChange={(e) => setInvitationLink(e.target.value)}
                      required
                    />
                  </label>
                  <button disabled={busy}>Continue password setup</button>
                </form>
              </details>
            )}
            {!invite && !recovery && (
              <button
                className="link"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    if (!email)
                      throw new Error("Enter your admin email first.");
                    await requestPasswordRecovery(email);
                    setMessage(
                      "If this account exists, a password reset email will arrive shortly.",
                    );
                  })
                }
              >
                Forgot password?
              </button>
            )}
            <p className="muted">
              Access is limited to invited administrators. Your public contact
              email does not control admin access.
            </p>
          </section>
        ) : (
          content && (
            <>
              {preview && (
                <aside className="preview">
                  Preview workspace. Content and inquiries here are separate
                  from your live site. Saved preview work stays available across
                  updates.
                </aside>
              )}
              <div className="title-row">
                <div>
                  <p className="eyebrow">Your website, up to date</p>
                  <h1>Website setup</h1>
                </div>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  View website ↗
                </a>
              </div>
              <nav aria-label="Admin sections">
                {[
                  ["homepage", "Homepage"],
                  ["projects", "Our work"],
                  ["contact", "Contact & email"],
                  ["inbox", "Inbox"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    aria-current={tab === key ? "page" : undefined}
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        setTab(key);
                        if (key === "inbox") setInbox(await api("inbox"));
                      })
                    }
                  >
                    {label}
                  </button>
                ))}
              </nav>
              {saveControls}
              <fieldset disabled={busy} className="workspace">
                {tab === "homepage" && homepage && (
                  <div className="homepage-editor">
                    <section className="panel homepage-overview">
                      <p className="eyebrow">Your selected design</p>
                      <h2>Main Street · teal &amp; copper</h2>
                      <p>Edit the words and photos below. The layout, colors, and button destinations stay consistent. Save website changes, then open View website to review.</p>
                      <p className="muted">Line breaks in headings and captions are preserved. The featured project is selected in Our work; public email and phone are managed in Contact &amp; email.</p>
                    </section>
                    {homepageFieldGroups.map((group, index) => (
                      <section className="panel" key={group.title}>
                        <h2>{group.title}</h2>
                        <div className="two">
                          <div>{group.fields.map(([key, label, limit]) => (
                            <Field key={key} label={`${label} (up to ${limit} characters)`} value={homepage[key]}
                              multiline={!["primaryLabel", "secondaryLabel", "communityButton", "closingButton"].includes(key)}
                              onChange={(value) => patchHomepage({ [key]: value })} />
                          ))}</div>
                          <div>
                            <h3>{["Oak photo", "Main Street photo", "Countryside photo"][index]}</h3>
                            <ImageEditor showCaption={index === 1} value={homepage[(["heroImage", "communityImage", "closingImage"] as const)[index]]}
                              onChange={(value) => patchHomepage({ [(["heroImage", "communityImage", "closingImage"] as const)[index]]: value })} run={run} />
                            <p className="muted">{index === 1 ? "The caption appears over the Main Street photo." : "This photo does not display a caption."}</p>
                          </div>
                        </div>
                      </section>
                    ))}
                    <section className="panel">
                      <h2>Four service summaries</h2>
                      <div className="two">{homepage.services.map((service, index) => (
                        <div key={index}>
                          <Field label={`Service ${index + 1} title`} value={service.title} onChange={(title) => patchHomepage({ services: homepage.services.map((s, i) => i === index ? { ...s, title } : s) })} />
                          <Field label="Short description" value={service.description} multiline onChange={(description) => patchHomepage({ services: homepage.services.map((s, i) => i === index ? { ...s, description } : s) })} />
                        </div>
                      ))}</div>
                    </section>
                  </div>
                )}
                {tab === "projects" && (
                  <>
                    <div className="toolbar">
                      <p>Add multiple examples. Publish when ready.</p>
                      <button
                        onClick={() => {
                          const p = blankProject();
                          edit({
                            ...content,
                            projects: [...content.projects, p],
                          });
                          setSelected(p.id);
                        }}
                      >
                        + Add project
                      </button>
                    </div>
                    <label className="featured-select">
                      Homepage featured project
                      <select
                        value={content.settings.featuredProjectId}
                        onChange={(e) =>
                          edit({
                            ...content,
                            settings: {
                              ...content.settings,
                              featuredProjectId: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">None</option>
                        {content.projects
                          .filter((p) => p.status === "published")
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title}
                            </option>
                          ))}
                      </select>
                    </label>
                    <div className="project-layout">
                      <aside className="project-list">
                        {content.projects.map((p) => (
                          <button
                            key={p.id}
                            className={selected === p.id ? "selected" : ""}
                            onClick={() => setSelected(p.id)}
                          >
                            <strong>{p.title}</strong>
                            <small>
                              {p.status} · order {p.order}
                            </small>
                          </button>
                        ))}
                        {!content.projects.length && (
                          <p>No projects yet. Add your first example.</p>
                        )}
                      </aside>
                      {project ? (
                        <section className="panel project-editor">
                          <h2>{project.title}</h2>
                          <Field
                            label="Project name"
                            value={project.title}
                            onChange={(title) => patchProject({ title })}
                          />
                          <Field
                            label="Project address (fixed after first save)"
                            value={project.slug}
                            disabled={savedIds.includes(project.id)}
                            onChange={(slug) => patchProject({ slug })}
                          />
                          <div className="two">
                            <label>
                              Visibility
                              <select
                                value={project.status}
                                onChange={(e) =>
                                  patchProject({
                                    status: e.target.value as Project["status"],
                                  })
                                }
                              >
                                <option value="draft">Draft — private</option>
                                <option value="published">
                                  Published — visible
                                </option>
                              </select>
                            </label>
                            <Field
                              label="Display order (lower appears first)"
                              value={String(project.order)}
                              type="number"
                              onChange={(v) =>
                                patchProject({ order: Number(v) })
                              }
                            />
                          </div>
                          <p className="muted">
                            {project.status === "draft"
                              ? "Drafts are saved privately. To show this project in Our work, complete the publishing details, choose Published, and save."
                              : "Save website changes to publish this project on this site’s Our work page."}
                          </p>
                          {(
                            [
                              "tagline",
                              "summary",
                              "business",
                              "location",
                              "category",
                              "website",
                            ] as const
                          ).map((key, i) => (
                            <Field
                              key={key}
                              label={
                                [
                                  "Introduction (required to publish)",
                                  "Short description (required to publish)",
                                  "Business type (required to publish)",
                                  "Location (optional)",
                                  "Project type (required to publish)",
                                  "Live website URL (optional)",
                                ][i]
                              }
                              value={project[key]}
                              multiline={key === "summary"}
                              onChange={(v) => patchProject({ [key]: v })}
                            />
                          ))}
                          <h3>Cover image</h3>
                          <ImageEditor
                            value={project.cover}
                            onChange={(cover) => patchProject({ cover })}
                            run={run}
                          />
                          {(["need", "build", "experience"] as const).map(
                            (key, i) => (
                              <React.Fragment key={key}>
                                <h3>
                                  {
                                    [
                                      "The need",
                                      "What we built",
                                      "The experience",
                                    ][i]
                                  }
                                </h3>
                                <Field
                                  label="Section heading"
                                  value={project[`${key}Title`]}
                                  onChange={(v) =>
                                    patchProject({ [`${key}Title`]: v })
                                  }
                                />
                                <Field
                                  label="Description"
                                  value={project[key]}
                                  multiline
                                  onChange={(v) => patchProject({ [key]: v })}
                                />
                              </React.Fragment>
                            ),
                          )}
                          <Field
                            label="What we delivered (one item per line)"
                            multiline
                            value={project.delivered.join("\n")}
                            onChange={(v) =>
                              patchProject({ delivered: v.split("\n") })
                            }
                          />
                          <h3>
                            Gallery <small>Up to six images</small>
                          </h3>
                          {project.gallery.map((value, i) => (
                            <div className="gallery-item" key={i}>
                              <ImageEditor
                                value={value}
                                onChange={(next) =>
                                  patchProject({
                                    gallery: project.gallery.map((image, n) =>
                                      i === n ? next : image,
                                    ),
                                  })
                                }
                                run={run}
                              />
                              <button
                                onClick={() =>
                                  patchProject({
                                    gallery: project.gallery.filter(
                                      (_, n) => i !== n,
                                    ),
                                  })
                                }
                              >
                                Remove image
                              </button>
                            </div>
                          ))}
                          {project.gallery.length < 6 && (
                            <button
                              onClick={() =>
                                patchProject({
                                  gallery: [...project.gallery, blankImage()],
                                })
                              }
                            >
                              + Add gallery image
                            </button>
                          )}
                          <div className="danger-zone">
                            <button
                              className="danger"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Remove this project? It will be removed from the website when you save.",
                                  )
                                ) {
                                  edit({
                                    ...content,
                                    settings: {
                                      ...content.settings,
                                      featuredProjectId:
                                        content.settings.featuredProjectId ===
                                        project.id
                                          ? ""
                                          : content.settings.featuredProjectId,
                                    },
                                    projects: content.projects.filter(
                                      (p) => p.id !== project.id,
                                    ),
                                  });
                                  setSelected("");
                                }
                              }}
                            >
                              Remove project
                            </button>
                            {project.status === "published" &&
                              savedIds.includes(project.id) && (
                                <a
                                  href={"/work/" + project.slug + "/"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View saved project ↗
                                </a>
                              )}
                          </div>
                        </section>
                      ) : (
                        <section className="panel">
                          <h2>Your work, in one place.</h2>
                          <p>
                            Select a project to edit its story, images, and
                            visibility.
                          </p>
                        </section>
                      )}
                    </div>
                  </>
                )}
                {tab === "contact" && (
                  <div className="contact-panels">
                    <section className="panel">
                      <h2>Contact details</h2>
                      <p>
                        Every “Let’s talk” form saves to your Inbox. These
                        settings apply across the website.
                      </p>
                      <Field
                        label="Public email address"
                        type="email"
                        value={content.settings.publicEmail}
                        onChange={(publicEmail) =>
                          edit({
                            ...content,
                            settings: { ...content.settings, publicEmail },
                          })
                        }
                      />
                      <Field
                        label="Public phone number"
                        type="tel"
                        value={content.settings.phone}
                        onChange={(phone) =>
                          edit({
                            ...content,
                            settings: { ...content.settings, phone },
                          })
                        }
                      />
                      <Field
                        label="Send inquiry notifications to"
                        type="email"
                        value={content.settings.notificationEmail}
                        onChange={(notificationEmail) =>
                          edit({
                            ...content,
                            settings: {
                              ...content.settings,
                              notificationEmail,
                            },
                          })
                        }
                      />
                      <p className="muted">
                        Use Save website changes to update these details.
                        Changing these addresses never changes administrator
                        access.
                      </p>
                    </section>
                    {mail && (
                      <section className="panel">
                        <h2>Email delivery</h2>
                        {mail.encryptionReady === false && (
                          <p className="preview">
                            Email connection setup needs one server
                            configuration step. Your Inbox already receives
                            messages. Ask your website administrator to complete
                            the email setup.
                          </p>
                        )}
                        <p>
                          Connect your business email provider using its SMTP
                          settings and an app password if required. Credentials
                          are encrypted and never shown on the website.
                        </p>
                        <p className="delivery-state">
                          {mail.enabled && mail.passwordConfigured
                            ? "Connection saved — send a test to verify delivery."
                            : "Email delivery is off. Inquiries still save to your Inbox."}
                        </p>
                        <label className="check">
                          <input
                            type="checkbox"
                            checked={mail.enabled}
                            onChange={(e) =>
                              mailPatch({ enabled: e.target.checked })
                            }
                          />
                          Enable notification emails
                        </label>
                        <Field
                          label="Mail server (SMTP hostname)"
                          value={mail.host}
                          onChange={(host) => mailPatch({ host })}
                        />
                        <label>
                          Secure port
                          <select
                            value={mail.port}
                            onChange={(e) =>
                              mailPatch({
                                port: Number(e.target.value) as 465 | 587,
                              })
                            }
                          >
                            <option value="587">587 — STARTTLS</option>
                            <option value="465">465 — TLS</option>
                          </select>
                        </label>
                        <Field
                          label="Mail account username"
                          value={mail.username}
                          onChange={(username) => mailPatch({ username })}
                        />
                        <Field
                          label="Sender email (authorized by your provider)"
                          value={mail.from}
                          type="email"
                          onChange={(from) => mailPatch({ from })}
                        />
                        <Field
                          label={
                            mail.passwordConfigured
                              ? "New password (leave blank to keep saved password)"
                              : "Mail password or app password"
                          }
                          value={mail.password ?? ""}
                          type="password"
                          onChange={(password) => mailPatch({ password })}
                        />
                        <div className="actions">
                          <button
                            onClick={() =>
                              void run(async () => {
                                const next = await api("mail", "PUT", mail);
                                setMail({ ...next, password: "" });
                                setMailDirty(false);
                                setMessage(
                                  "Email connection saved. Send a test to verify it.",
                                );
                              })
                            }
                          >
                            Save email connection
                          </button>
                          <button
                            disabled={
                              mailDirty ||
                              dirty ||
                              !mail.enabled ||
                              !mail.passwordConfigured
                            }
                            onClick={() =>
                              void run(async () => {
                                const result = await api(
                                  "test-mail",
                                  "POST",
                                  {},
                                );
                                setMessage(result.message);
                              })
                            }
                          >
                            Send test email
                          </button>
                        </div>
                      </section>
                    )}
                  </div>
                )}
                {tab === "inbox" && (
                  <section className="panel">
                    <div className="toolbar">
                      <h2>Website inquiries</h2>
                      <button
                        onClick={() =>
                          void run(async () => setInbox(await api("inbox")))
                        }
                      >
                        Refresh
                      </button>
                    </div>
                    {!inbox.length && (
                      <p>
                        No inquiries yet. Messages from your website forms will
                        appear here.
                      </p>
                    )}
                    {inbox.map((item) => (
                      <details className="inquiry" key={item.id}>
                        <summary>
                          <strong>{item.name}</strong>
                          <span>{item.business || item.email}</span>
                          <small>
                            {new Date(item.createdAt).toLocaleString()} ·{" "}
                            {item.status}
                          </small>
                        </summary>
                        <dl>
                          <dt>Email</dt>
                          <dd>
                            <a
                              href={"mailto:" + encodeURIComponent(item.email)}
                            >
                              {item.email}
                            </a>
                          </dd>
                          <dt>Phone</dt>
                          <dd>{item.phone || "Not provided"}</dd>
                          <dt>Interest</dt>
                          <dd>{item.service}</dd>
                          <dt>Email notification</dt>
                          <dd>
                            {item.notification === "sent"
                              ? "Sent"
                              : item.notification === "failed"
                                ? "Failed — message saved here"
                                : "Not configured — message saved here"}
                          </dd>
                        </dl>
                        <p className="message-body">{item.message}</p>
                        <label>
                          Status
                          <select
                            value={item.status}
                            onChange={(e) => {
                              const status = e.target
                                .value as Inquiry["status"];
                              void run(async () => {
                                await api("inbox/" + item.id, "PATCH", {
                                  status,
                                });
                                setInbox(
                                  inbox.map((v) =>
                                    v.id === item.id ? { ...v, status } : v,
                                  ),
                                );
                              });
                            }}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="archived">Archived</option>
                          </select>
                        </label>
                      </details>
                    ))}
                  </section>
                )}
              </fieldset>
              {saveControls}
            </>
          )
        )}
      </main>
      <footer>Sixteen Oaks Workflow Solutions · Private administration</footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Admin />);
