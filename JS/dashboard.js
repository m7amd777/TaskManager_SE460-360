// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    initCards();
    initProgressBar();
  
    const journalPrompts = [
      "What’s one small win you had today, and how did it make you feel?",
      "If you had an extra hour right now, how would you spend it and why?",
      "Write about a time you surprised yourself by doing something out of your comfort zone."
    ];
  
    const quotesOfTheDay = [
      "“Believe you can and you’re halfway there.” – Theodore Roosevelt",
      "“Success is the sum of small efforts, repeated day in and day out.” – Robert Collier",
      "“The secret of getting ahead is getting started.” – Mark Twain"
    ];
  
    initSlideshow('journal', journalPrompts, 6000);
    initSlideshow('quote',   quotesOfTheDay,  9000);
  
    document.addEventListener('taskChanged', updateProgressBar);
  });
  
  // … rest of your dashboard.js …
  
  
  function initCards() {
    const img = document.getElementById('tasks-image');
    if (!img) return;
    img.addEventListener('click', () => {
      window.location.href = 'task_categories.html';
    });
  }
  
  
  // PROGRESS BAR
  function initProgressBar() {
    updateProgressBar();
  }
  function updateProgressBar() {
    // assumes your existing `tasks` array from script2.js
    const total   = window.tasks?.length || 0;
    const done    = window.tasks?.filter(t => t.completed).length || 0;
    const percent = total ? Math.round((done/total)*100) : 0;
  
    const fill = document.querySelector('.progress-fill');
    const text = document.querySelector('.progress-text');
    fill.style.width    = percent + '%';
    text.textContent    = percent + '%';
  }
  
  // GENERIC SLIDESHOW
  function initSlideshow(prefix, items, interval) {
    const container = document.getElementById(`${prefix}-slides`);
    const dotsCt    = document.getElementById(`${prefix}-dots`);
    let idx = 0;
  
    // build slides + dots
    items.forEach((txt,i) => {
      const s = document.createElement('div');
      s.className = 'slide';
      s.innerHTML = `<p>${txt}</p>`;
      container.appendChild(s);
  
      const d = document.createElement('span');
      d.className = 'dot';
      d.addEventListener('click', () => goTo(i));
      dotsCt.appendChild(d);
    });
  
    const slides = container.querySelectorAll('.slide');
    const dots   = dotsCt.querySelectorAll('.dot');
  
    function goTo(i) {
      slides[idx].classList.remove('active');
      dots[idx].classList.remove('active');
      idx = i;
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
    }
  
    // start
    goTo(0);
    setInterval(() => {
      goTo((idx + 1) % items.length);
    }, interval);
  }
  