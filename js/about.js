const teamMembers = [
  {
    id: 1,
    name: "Amer Samman",
    role: "Project Manager / Database",
    major: "Computer Science",
    description:
      "Led the overall project architecture and coordinated team efforts. Implemented the core authentication system and managed the development timeline to ensure successful delivery.",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    icon: "users",
  },
  {
    id: 2,
    name: "Evan Wilcher",
    role: "Frontend Developer",
    major: "Computer Science",
    description:
      "Designed and developed the user interface components using HTML, CSS, and JavaScript. Created responsive layouts and implemented smooth animations for enhanced user experience.",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    icon: "code",
  },
  {
    id: 3,
    name: "Heather Lancaster",
    role: "API",
    major: "Computer Science",
    description:
      "Engineered robust server-side systems and REST APIs to power the application. Integrated authentication and authorization mechanisms, designed database schemas, and ensured secure and efficient data flow between the frontend and backend.",
    image:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    icon: "braces",
  },
  {
    id: 4,
    name: "Laila Khalil",
    role: "Frontend Developer",
    major: "Computer Science",
    description:
      "Specialized in building interactive features and optimizing performance on the client side. Translated design mockups into functional components, implemented state management, and fine-tuned rendering to deliver a polished and reliable user interface.",
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    icon: "code",
  },
  {
    id: 5,
    name: "Dylan",
    role: "API",
    major: "Computer Science",
    description:
      "Focused on designing scalable API endpoints to connect core services. Implemented data validation, error handling, and optimized queries to improve performance. Collaborated closely with frontend developers to provide consistent and reliable API responses.",
    image:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    icon: "braces",
  },
];

// ---- Render helpers ----
function memberCard(member, delayMs) {
  return `
    <article
      class="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-400/50 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 card-hover fade-up"
      style="animation-delay:${delayMs}ms"
    >
      <!-- Gold accent line -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

      <!-- Profile Image -->
      <div class="relative p-8 pb-4">
        <div class="relative mx-auto w-32 h-32 mb-6">
          <img
            src="${member.image}"
            alt="${member.name}"
            class="w-full h-full object-cover rounded-full border-4 border-gray-600 group-hover:border-yellow-400 transition-colors duration-300"
          />
          <div class="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        <!-- Role Icon -->
        <div class="absolute top-4 right-4 w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300">
          <i data-lucide="${member.icon}" class="w-5 h-5"></i>
        </div>
      </div>

      <!-- Member Info -->
      <div class="px-8 pb-8">
        <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
          ${member.name}
        </h3>

        <div class="mb-4 space-y-1">
          <p class="text-yellow-400 font-semibold text-lg">${member.role}</p>
          <p class="text-gray-400 flex items-center">
            <i data-lucide="graduation-cap" class="w-4 h-4 mr-2"></i>
            ${member.major}
          </p>
        </div>

        <div class="relative">
          <div class="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
          <p class="text-gray-300 leading-relaxed pl-4">
            ${member.description}
          </p>
        </div>
      </div>
    </article>
  `;
}

function render() {
  const top = document.getElementById("top-row");
  const bottom = document.getElementById("bottom-row");

  // First 3
  teamMembers.slice(0, 3).forEach((m, i) => {
    top.insertAdjacentHTML("beforeend", memberCard(m, i * 150));
  });

  // Last 2
  teamMembers.slice(3).forEach((m, i) => {
    bottom.insertAdjacentHTML("beforeend", memberCard(m, (i + 3) * 150));
  });

  // Activate icons after DOM is updated
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", render);
