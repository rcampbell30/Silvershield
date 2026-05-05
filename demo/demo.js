const status = document.getElementById("copy-status");

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const card = button.closest(".example-card");
    const text = card.querySelector("pre")?.textContent?.trim() || "";

    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Example copied. Open Silver Shield from the toolbar and paste it into the checker.";
    } catch {
      status.textContent = "Copy failed. Select the example text manually and copy it.";
    }

    window.setTimeout(() => {
      status.textContent = "";
    }, 4000);
  });
});
