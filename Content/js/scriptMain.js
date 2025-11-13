const dropdown = document.getElementById('pageSelectDropdown');
dropdown.addEventListener('change', () => {
  const page = dropdown.value;
  if (page) window.location.href = page;
});

// reveal container children as they enter viewport
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".container > *");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
});
