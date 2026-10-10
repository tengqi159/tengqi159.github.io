/* Draft locally; opening the mail app is always a visitor action. */
(() => {
  function setupCollaboration() {
    const section = document.getElementById("collaboration");
    if (!section) return;
    const builder = document.getElementById("collaboration-builder");
    const subjectField = document.getElementById("collaboration-subject");
    const bodyField = document.getElementById("collaboration-body");
    const emailLink = document.getElementById("collaboration-email");
    const copyDraft = document.getElementById("collaboration-copy-draft");
    const reset = document.getElementById("collaboration-reset");
    const status = document.getElementById("collaboration-draft-status");
    const update = document.getElementById("collaboration-update");
    if (!builder || !subjectField || !bodyField || !emailLink || !copyDraft || !reset || !status || !update) return;

    const email = window.siteData?.profile?.institutionalEmail || "tq@zzu.edu.cn";
    const topics = {
      wearable: "wearables & time series",
      efficient: "efficient models",
      graphs: "graph learning"
    };
    const introductions = {
      student: "I’m [name], a student at [institution].",
      researcher: "I’m [name], working on [area] at [institution].",
      curious: "I’m [name]. I came across your work and wanted to say hello."
    };
    const guidance = {
      student: "Bring a question, a small project, or a paper that caught your eye.",
      researcher: "Share a connection between our work, or a question to tackle together.",
      curious: "An unfinished idea is a good start, too."
    };
    let generated = { subject: "", body: "" };
    let undo = null;

    function makeOutline() {
      const interests = [...section.querySelectorAll('input[name="collaboration-topic"]:checked')]
        .map(input => topics[input.value]).filter(Boolean);
      const background = section.querySelector('input[name="collaboration-audience"]:checked')?.value || "curious";
      const subject = interests.length ? `Let’s talk research — ${interests.join(" / ")}` : "Let’s talk research";
      const question = interests.length
        ? `I’m interested in ${interests.join(" and ")}, especially [your question or idea].`
        : "I’d love to explore [your question or idea] together.";
      return {
        subject,
        body: ["Hi Dr. Teng,", "", introductions[background] || introductions.curious,
          question, "[Optional project or paper link]", "", "Best, [name]"].join("\n"),
        guidance: guidance[background] || guidance.curious
      };
    }

    function syncDraft() {
      emailLink.href = `mailto:${email}?subject=${encodeURIComponent(subjectField.value)}&body=${encodeURIComponent(bodyField.value)}`;
      document.getElementById("collaboration-preview").textContent = subjectField.value || "Your research conversation";
      copyDraft.dataset.copy = `To: ${email}\nSubject: ${subjectField.value}\n\n${bodyField.value}`;
      const edited = subjectField.value !== generated.subject || bodyField.value !== generated.body;
      document.getElementById("collaboration-edited").hidden = !edited;
      reset.textContent = undo ? "Undo reset" : "Reset draft";
      reset.disabled = !edited && !undo;
      status.textContent = undo ? "Fresh outline ready. You can undo the reset."
        : edited ? "Your edits stay when you switch topics or background."
        : "Make it yours. A few lines are enough.";
    }

    function updateChoices(announce = false) {
      const keepSubject = subjectField.value !== generated.subject;
      const keepBody = bodyField.value !== generated.body;
      const next = makeOutline();
      if (!keepSubject) subjectField.value = next.subject;
      if (!keepBody) bodyField.value = next.body;
      generated = { subject: next.subject, body: next.body };
      document.getElementById("collaboration-guidance").textContent = next.guidance;
      syncDraft();
      if (announce) update.textContent = keepSubject || keepBody
        ? "Interests updated. Your edited text was kept."
        : "Email outline updated.";
    }

    section.addEventListener("change", event => {
      if (event.target.matches('input[name="collaboration-topic"], input[name="collaboration-audience"]')) updateChoices(true);
    });
    [subjectField, bodyField].forEach(field => field.addEventListener("input", () => {
      undo = null;
      syncDraft();
    }));
    reset.addEventListener("click", () => {
      if (undo) {
        subjectField.value = undo.subject;
        bodyField.value = undo.body;
        undo = null;
        update.textContent = "Your previous draft was restored.";
      } else {
        undo = { subject: subjectField.value, body: bodyField.value };
        subjectField.value = generated.subject;
        bodyField.value = generated.body;
        update.textContent = "Draft reset. Use Undo reset to restore your text.";
      }
      syncDraft();
    });
    // Read the current fields again at the action, including browser-restored values.
    emailLink.addEventListener("click", syncDraft);
    copyDraft.addEventListener("click", syncDraft);
    updateChoices();
    document.getElementById("collaboration-fallback").hidden = true;
    builder.hidden = false;
    document.getElementById("collaboration-mail-note").textContent = "Your draft opens in your email app. Edit before sending.";
    copyDraft.hidden = false;
    const copyEmail = document.getElementById("collaboration-copy-email");
    if (copyEmail) { copyEmail.dataset.copy = email; copyEmail.hidden = false; }
  }
  document.addEventListener("DOMContentLoaded", setupCollaboration);
})();
