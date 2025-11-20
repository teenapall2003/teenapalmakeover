// Course data
const courses = [
  {
    id: "pma",
    name: "Professional Makeup Artist (PMA)",
    duration: "3 months",
    fee: 15000,
    description: "Comprehensive course covering skin prep, contouring, bridal makeup, HD techniques, and portfolio work."
  },
  {
    id: "bridal",
    name: "Advanced Bridal Makeup",
    duration: "1 month",
    fee: 10000,
    description: "Specialized bridal looks, trials, client consultation, and long-wear techniques."
  },
  {
    id: "glam",
    name: "Glam Makeup Masterclass",
    duration: "2 weeks",
    fee: 5000,
    description: "Weekend intensive for evening and party glamour — focus on eyes and contouring."
  },
  {
    id: "makeupbasics",
    name: "Makeup Basics & Skincare",
    duration: "2 weeks",
    fee: 3000,
    description: "For beginners — foundations, concealing, everyday looks and essential skincare routines."
  }
];

// Utility to format currency (INR)
function formatINR(n){ return "₹" + n.toLocaleString("en-IN"); }

// Build courses list
const coursesList = document.getElementById("courses-list");
const courseSelect = document.getElementById("course-select");
const filterDuration = document.getElementById("filter-duration");
const filterPrice = document.getElementById("filter-price");

function renderCourses(list){
  coursesList.innerHTML = "";
  list.forEach(c=>{
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <div>
        <h3>${c.name}</h3>
        <div class="course-meta">${c.duration} • <span class="course-price">${formatINR(c.fee)}</span></div>
        <p class="muted">${c.description}</p>
      </div>
      <div class="course-bottom">
        <button class="btn view-btn" data-id="${c.id}">View</button>
        <button class="btn enroll-btn" data-id="${c.id}">Enroll</button>
      </div>
    `;
    coursesList.appendChild(card);
  });
  // Attach listeners
  document.querySelectorAll(".view-btn").forEach(b=>b.addEventListener("click",openModal));
  document.querySelectorAll(".enroll-btn").forEach(b=>b.addEventListener("click",startEnroll));
}

// Populate course select in form
function populateCourseSelect(){
  courseSelect.innerHTML = "";
  courses.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.name} — ${c.duration} — ${formatINR(c.fee)}`;
    courseSelect.appendChild(opt);
  });
}

function openModal(e){
  const id = e.target.dataset.id;
  const c = courses.find(x=>x.id===id);
  if(!c) return;
  document.getElementById("modal-title").textContent = c.name;
  document.getElementById("modal-duration-fee").textContent = `${c.duration} • ${formatINR(c.fee)}`;
  document.getElementById("modal-description").textContent = c.description;
  document.getElementById("course-modal").setAttribute("aria-hidden","false");
  // enroll button inside modal
  document.getElementById("modal-enroll").onclick = ()=>{ selectCourseAndScrollToForm(c.id); closeModal(); };
}

function closeModal(){ document.getElementById("course-modal").setAttribute("aria-hidden","true"); }
document.getElementById("modal-close").addEventListener("click", closeModal);

// Enroll button from card
function startEnroll(e){
  selectCourseAndScrollToForm(e.target.dataset.id);
}

// Select course in form and scroll
function selectCourseAndScrollToForm(id){
  courseSelect.value = id;
  document.getElementById("course-select").scrollIntoView({behavior:"smooth",block:"center"});
}

// Filter logic
function applyFilters(){
  let res = [...courses];
  const dur = filterDuration.value;
  const price = filterPrice.value;

  if(dur !== "all"){
    res = res.filter(c=>c.duration.toLowerCase() === dur.toLowerCase());
  }
  if(price !== "all"){
    if(price === "low") res = res.filter(c=>c.fee <= 6000);
    if(price === "mid") res = res.filter(c=>c.fee > 6000 && c.fee <= 12000);
    if(price === "high") res = res.filter(c=>c.fee > 12000);
  }
  renderCourses(res);
}

filterDuration.addEventListener("change", applyFilters);
filterPrice.addEventListener("change", applyFilters);

// Enrollment form handling (client-side)
document.getElementById("enroll-form").addEventListener("submit", function(e){
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const courseId = courseSelect.value;
  const course = courses.find(c=>c.id===courseId);
  if(!name || !phone){
    alert("Kripya naam aur phone sahi bharein.");
    return;
  }
  // For now: show a polite message. Replace with backend API call as needed.
  alert(`Thank you ${name}! Aapke enrollment request for "${course.name}" receive ho gaye hain. We'll contact you on ${phone}.`);
  this.reset();
});

// init
renderCourses(courses);
populateCourseSelect();