const setupReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
};

const setupPageTransition = () => {
  const links = document.querySelectorAll('a[href$=".html"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href");
      if (!target || target.startsWith("http") || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => {
        window.location.href = target;
      }, 230);
    });
  });
};

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");
  setupReveal();
  setupPageTransition();
});
