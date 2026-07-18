(function(){

var header = document.getElementById('site-header');
if(header){
  var ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(function(){
        header.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

var menuBtn = document.getElementById('mobile-btn');
var mobileMenu = document.getElementById('mobile-menu');
if(menuBtn && mobileMenu){
  menuBtn.addEventListener('click', function(){
    menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}

var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
navLinks.forEach(function(link){
  link.addEventListener('click', function(e){
    var href = link.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      var target = document.getElementById(href.slice(1));
      if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if(menuBtn && mobileMenu && menuBtn.classList.contains('open')){
      menuBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

var revealObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -20% 0px' });

document.querySelectorAll('[class*="animate-"]').forEach(function(el){
  if(!el.classList.contains('anim-hero')) revealObserver.observe(el);
});

document.querySelectorAll('.stagger-children').forEach(function(container){
  Array.from(container.children).forEach(function(el, i){
    el.style.setProperty('--i', i);
    if(!el.classList.contains('animate-up') &&
       !el.classList.contains('animate-left') &&
       !el.classList.contains('animate-right') &&
       !el.classList.contains('animate-scale')){
      el.classList.add('animate-up');
      revealObserver.observe(el);
    }
  });
});

var parallaxEls = document.querySelectorAll('[data-parallax]');
if(parallaxEls.length){
  var pticking = false;
  window.addEventListener('scroll', function(){
    if(!pticking){
      requestAnimationFrame(function(){
        var vh = window.innerHeight;
        parallaxEls.forEach(function(el){
          var speed = parseFloat(el.dataset.parallax) || 0.04;
          var rect = el.getBoundingClientRect();
          var center = (rect.top + rect.height / 2) / vh;
          var offset = (center - 0.5) * speed * 200;
          el.style.setProperty('--parallax-offset', offset + 'px');
        });
        pticking = false;
      });
      pticking = true;
    }
  }, { passive: true });
}

var particleContainer = document.getElementById('particles');
if(particleContainer){
  for(var i = 0; i < 25; i++){
    var p = document.createElement('div');
    p.className = 'particle';
    var size = 2 + Math.random() * 4;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = 0.2 + Math.random() * 0.4;
    particleContainer.appendChild(p);
  }
}

var entries = document.querySelectorAll('.scp-entry');
entries.forEach(function(entry){
  entry.addEventListener('click', function(){
    entries.forEach(function(e){ e.classList.remove('active'); });
    entry.classList.add('active');
  });
});
var badge = document.querySelector('.scp-badge');
if(badge){
  setInterval(function(){
    badge.style.opacity = '.6';
    setTimeout(function(){ badge.style.opacity = '1'; }, 300);
  }, 3000);
}

var tabs = document.querySelectorAll('.scs-item');
var mainImage = document.querySelector('.sc-image');
if(tabs.length && mainImage){
  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      mainImage.style.opacity = '0';
      setTimeout(function(){
        mainImage.src = 'app.png';
        mainImage.style.opacity = '1';
      }, 150);
    });
  });
}

function copyText(btn){
  var code = btn.parentElement.querySelector('code');
  if(code){
    navigator.clipboard.writeText(code.textContent).then(function(){
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function(){ btn.textContent = orig; }, 2000);
    });
  }
}
window.copyText = copyText;

var wfSection = document.getElementById('process');
if(wfSection){
  var agents = [
    { id:'orchestrator', label:'Orchestrator', x:100, y:100 },
    { id:'code',         label:'Code',         x:300, y:100 },
    { id:'research',     label:'Research',     x:100, y:300 },
    { id:'review',       label:'Review',       x:300, y:300 },
  ];
  var routes = [
    { from:0, to:1 },{ from:1, to:0 },
    { from:0, to:2 },{ from:2, to:0 },
    { from:0, to:3 },{ from:3, to:0 },
    { from:1, to:2 },{ from:2, to:1 },
    { from:1, to:3 },{ from:3, to:1 },
    { from:2, to:3 },{ from:3, to:2 },
  ];
  var logMessages = {
    orchestrator: ['Analyzing task queue...','Assigning next task...','Delegating to team...','Scheduling pipeline...','Balancing workload...'],
    code: ['Generating TypeScript...','Writing unit tests...','Refactoring module...','Building API...','Compiling assets...'],
    research: ['Searching documentation...','Finding API examples...','Analyzing requirements...','Cross-referencing data...','Fetching references...'],
    review: ['Checking pull request...','Running static analysis...','Tests passed.','Lint OK.','Approving changes...'],
  };
  var lineEls = wfSection.querySelectorAll('.wf-line');
  var particleEl = wfSection.querySelector('.wf-particle');
  var logContainer = document.getElementById('wf-log-messages');
  var nodeEls = {};
  agents.forEach(function(a){
    var el = wfSection.querySelector('.wf-node[data-agent="'+a.id+'"]');
    if(el) nodeEls[a.id] = el;
  });
  var animating = false;
  var animTimers = [];
  var stepCount = 0;
  var maxSteps = 8;
  var particleFrame = null;
  function setNodeActive(agentIdx, state){
    var agent = agents[agentIdx];
    var el = nodeEls[agent.id];
    if(el){ if(state) el.classList.add('active'); else el.classList.remove('active'); }
  }
  function setLineActive(routeIdx, state){
    var el = lineEls[routeIdx];
    if(el){ if(state) el.classList.add('active'); else el.classList.remove('active'); }
  }
  function addLogEntry(agentId, msg){
    var agent = agents.find(function(a){ return a.id === agentId; });
    if(!agent) return;
    var entry = document.createElement('div');
    entry.className = 'wf-log-entry';
    entry.innerHTML = '<span class="wf-log-agent">'+agent.label+'</span> <span class="wf-log-msg">'+msg+'</span>';
    logContainer.appendChild(entry);
    while(logContainer.children.length > 5) logContainer.removeChild(logContainer.firstChild);
    requestAnimationFrame(function(){ entry.classList.add('visible'); });
  }
  function clearTimers(){
    animTimers.forEach(function(t){ clearTimeout(t); });
    animTimers = [];
  }
  function animateParticle(x1, y1, x2, y2, duration){
    if(particleFrame) cancelAnimationFrame(particleFrame);
    particleEl.classList.add('active');
    var start = performance.now();
    function tick(now){
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var x = x1 + (x2 - x1) * eased;
      var y = y1 + (y2 - y1) * eased;
      particleEl.setAttribute('cx', x);
      particleEl.setAttribute('cy', y);
      if(t < 1) particleFrame = requestAnimationFrame(tick);
      else particleEl.classList.remove('active');
    }
    particleFrame = requestAnimationFrame(tick);
  }
  function step(){
    if(!animating) return;
    if(stepCount >= maxSteps) return;
    stepCount++;
    var fromIdx = Math.floor(Math.random() * agents.length);
    var possible = routes.filter(function(r){ return r.from === fromIdx; });
    var route = possible[Math.floor(Math.random() * possible.length)];
    var routeIdx = routes.indexOf(route);
    var toIdx = route.to;
    agents.forEach(function(a,i){ setNodeActive(i, false); });
    setNodeActive(fromIdx, true);
    setNodeActive(toIdx, true);
    setLineActive(routeIdx, true);
    animateParticle(agents[fromIdx].x, agents[fromIdx].y, agents[toIdx].x, agents[toIdx].y, 500);
    var msgs = logMessages[agents[toIdx].id];
    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    addLogEntry(agents[toIdx].id, msg);
    var t1 = setTimeout(function(){ setLineActive(routeIdx, false); }, 700);
    var pause = 800 + Math.random() * 1200;
    var t2 = setTimeout(function(){ step(); }, pause);
    animTimers.push(t1, t2);
  }
  function start(){
    if(animating) return;
    stepCount = 0;
    animating = true;
    clearTimers();
    logContainer.innerHTML = '';
    addLogEntry('orchestrator', 'Initializing team...');
    setTimeout(function(){
      setNodeActive(0, true);
      setTimeout(function(){ step(); }, 1500);
    }, 500);
  }
  function stop(){
    animating = false;
    clearTimers();
    if(particleFrame){ cancelAnimationFrame(particleFrame); particleFrame = null; }
    agents.forEach(function(a,i){ setNodeActive(i, false); });
    for(var i = 0; i < lineEls.length; i++) lineEls[i].classList.remove('active');
    if(particleEl) particleEl.classList.remove('active');
  }
  var wfObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting) start();
      else stop();
    });
  }, {threshold: 0.2});
  wfObs.observe(wfSection);
}

})();
