// script.js - Enhancing navigation, smooth scrolling, active link highlighting, back-to-top button, and mobile menu toggle

document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling for navigation links with fallback for external pages
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSelector = this.getAttribute('href');
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        // Smooth scroll if target element exists on the current page
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Otherwise, navigate to the URL (e.g., different page)
        window.location.href = targetSelector;
      }
    });
  });

  // Active navigation link highlighting based on scroll position
  const sections = document.querySelectorAll('main section');
  function updateActiveNav() {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop - sectionHeight * 0.25) {
        currentSectionId = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }
  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav);

  // Back-to-Top Button Functionality
  // Ensure there's an element with id="back-to-top" in your HTML
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    // Show or hide the button based on scroll position
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });
    // Smooth scroll back to top on button click
    backToTopButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Menu Toggle Functionality
  // Ensure there's an element with id="mobile-menu-toggle" and nav ul structure in your HTML
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function () {
      const navMenu = document.querySelector('nav ul');
      navMenu.classList.toggle('open'); // Toggle the 'open' class to show/hide the mobile menu
    });
  }
});
