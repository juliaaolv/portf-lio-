const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


/* Animação suave de entrada */

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.12
    }
);


document
    .querySelectorAll(
        ".section-heading, .about-text, .info-item, .project-card, .skill"
    )
    .forEach(element => {
        element.classList.add("hidden");
        observer.observe(element);
    });


