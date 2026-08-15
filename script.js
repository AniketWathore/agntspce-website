(function(){

/* ─── Beta Banner ─── */
(function(){
  var body = document.body;
  if(!body) return;
  var banner = document.createElement('div');
  banner.className = 'beta-banner';
  banner.innerHTML = '<span class="beta-badge">Beta is live</span><a href="download.html" class="beta-link">Try the beta now <span class="beta-arrow">&rarr;</span></a>';
  body.classList.add('has-banner');
  body.insertBefore(banner, body.firstChild);
  var ticking = false;
  function update(){
    body.classList.toggle('banner-hidden', window.scrollY > 60);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
})();

/* ─── Download Button (auto OS) ─── */
(function(){
  var dlText = document.getElementById('dl-text');
  var dlIcon = document.querySelector('#dl-btn img');
  if(!dlText) return;
  var ua = navigator.userAgent;
  var os = 'mac';
  if(/Windows/i.test(ua)) os = 'windows';
  else if(/Linux/i.test(ua)) os = 'linux';
  else if(/Mac/i.test(ua)) os = 'mac';
  var labels = { mac:'Download for macOS', windows:'Download for Windows', linux:'Download for Linux' };
  var icons  = { mac:'img/macos-icon.png', windows:'img/windows-icon.png', linux:'img/linux-icon.png' };
  dlText.textContent = labels[os];
  if(dlIcon) dlIcon.src = icons[os];
})();

/* ─── Scroll Pop Reveal ─── */
(function(){
  var els = document.querySelectorAll('.pop-reveal');
  if(!els.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function(el){ obs.observe(el); });
})();


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

var animTimers = [];
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

/* â”€â”€â”€ Feature Section Scroll Reveals â”€â”€â”€ */
(function(){
  var animTimers = [];

  function animateNumber(el, start, end, duration){
    if(!el) return;
    var startTime = performance.now();
    function tick(now){
      var t = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = Math.round(start + (end - start) * eased);
      el.textContent = formatTokens(val);
      if(t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function formatTokens(n){
    if(n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k';
    return n;
  }

  function initAgentLauncher(){
    var agents = document.querySelectorAll('#demo-multi-agent .al-agent');
    var expanding = null;
    agents.forEach(function(el){
      el.addEventListener('click', function(){
        if(expanding === el){
          el.classList.remove('expanding');
          el.querySelectorAll('.al-step').forEach(function(s){
            s.classList.remove('show','active','done');
          });
          expanding = null;
          return;
        }
        if(expanding){
          var prev = expanding;
          prev.classList.remove('expanding');
          prev.querySelectorAll('.al-step').forEach(function(s){
            s.classList.remove('show','active','done');
          });
        }
        el.classList.add('expanding');
        expanding = el;
        var steps = el.querySelectorAll('.al-step');
        steps.forEach(function(s, i){
          var t1 = setTimeout(function(){
            s.classList.add('show');
            s.classList.add('active');
            var t2 = setTimeout(function(){
              s.classList.remove('active');
              s.classList.add('done');
              if(i === steps.length - 1){
                var t3 = setTimeout(function(){
                  el.classList.remove('expanding');
                  steps.forEach(function(st){
                    st.classList.remove('show','active','done');
                  });
                  expanding = null;
                }, 1200);
                animTimers.push(t3);
              }
            }, 700);
            animTimers.push(t2);
          }, 300 + i * 800);
          animTimers.push(t1);
        });
      });
    });
  }

  function animateTokenReduction(){
    var stages = [
      {id:'input',width:100,target:120000},
      {id:'compress',width:60,target:48000},
      {id:'filter',width:40,target:16000},
      {id:'context',width:28,target:4000},
      {id:'output',width:25,target:4000}
    ];
    var stageEls = document.querySelectorAll('.tk-stage');
    var arrowEls = document.querySelectorAll('.tk-arrow');
    stages.forEach(function(s, i){
      var bar = document.getElementById('tk-bar-' + s.id);
      var count = document.getElementById('tk-count-' + s.id);
      var stage = stageEls[i];
      if(!bar||!count||!stage) return;
      bar.style.width = '0%';
      count.textContent = '0';
      var t = setTimeout(function(){
        stage.classList.add('show');
        if(arrowEls[i]) arrowEls[i].classList.add('show');
        bar.style.width = s.width + '%';
        animateNumber(count,0,s.target,700);
      }, 200 + i * 600);
      animTimers.push(t);
    });
  }

  function animateWorkflow(){
    var agents = [
      { id:'orchestrator', label:'Orchestrator', x:100, y:100 },
      { id:'code',         label:'Code',         x:300, y:100 },
      { id:'research',     label:'Research',     x:100, y:300 },
      { id:'review',       label:'Review',       x:300, y:300 },
    ];
    var routes = [
      { from:0, to:1 }, { from:1, to:0 },
      { from:0, to:2 }, { from:2, to:0 },
      { from:0, to:3 }, { from:3, to:0 },
      { from:1, to:2 }, { from:2, to:1 },
      { from:1, to:3 }, { from:3, to:1 },
      { from:2, to:3 }, { from:3, to:2 },
    ];
    var logMessages = {
      orchestrator: ['Analyzing task queue...','Assigning next task...','Delegating to team...','Scheduling pipeline...','Balancing workload...'],
      code:         ['Generating TypeScript...','Writing unit tests...','Refactoring module...','Building API...','Compiling assets...'],
      research:     ['Searching documentation...','Finding API examples...','Analyzing requirements...','Cross-referencing data...','Fetching references...'],
      review:       ['Checking pull request...','Running static analysis...','Tests passed.','Lint OK.','Approving changes...'],
    };
    var lineEls = document.querySelectorAll('#demo-worktree .wf-line');
    var particleEl = document.querySelector('#demo-worktree .wf-particle');
    var logContainer = document.getElementById('wf-log-messages');
    var nodeEls = {};
    agents.forEach(function(a){
      var el = document.querySelector('#demo-worktree .wf-node[data-agent="'+a.id+'"]');
      if(el) nodeEls[a.id] = el;
    });
    var particleFrame = null;
    var stepCount = 0;
    var maxSteps = 10;

    function setNodeActive(agentIdx, state){
      var agent = agents[agentIdx];
      var el = nodeEls[agent.id];
      if(el){
        if(state) el.classList.add('active');
        else el.classList.remove('active');
      }
    }
    function setLineActive(routeIdx, state){
      var el = lineEls[routeIdx];
      if(el){
        if(state) el.classList.add('active');
        else el.classList.remove('active');
      }
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
      if(stepCount >= maxSteps) return;
      stepCount++;
      var fromIdx = Math.floor(Math.random() * agents.length);
      var possible = routes.filter(function(r){ return r.from === fromIdx; });
      var route = possible[Math.floor(Math.random() * possible.length)];
      var routeIdx = routes.indexOf(route);
      var toIdx = route.to;
      var fromAgent = agents[fromIdx];
      var toAgent = agents[toIdx];
      agents.forEach(function(a,i){ setNodeActive(i, false); });
      setNodeActive(fromIdx, true);
      setNodeActive(toIdx, true);
      setLineActive(routeIdx, true);
      animateParticle(fromAgent.x, fromAgent.y, toAgent.x, toAgent.y, 500);
      var msgs = logMessages[toAgent.id];
      var msg = msgs[Math.floor(Math.random() * msgs.length)];
      addLogEntry(toAgent.id, msg);
      var t1 = setTimeout(function(){ setLineActive(routeIdx, false); }, 700);
      var pause = 800 + Math.random() * 1200;
      var t2 = setTimeout(function(){ step(); }, pause);
      animTimers.push(t1, t2);
    }
    addLogEntry('orchestrator', 'Initializing team...');
    setTimeout(function(){
      setNodeActive(0, true);
      setTimeout(function(){ step(); }, 1500);
    }, 500);
  }

  var triggered = {};
  var revealObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target;
      el.querySelectorAll('[data-reveal]').forEach(function(child){
        child.classList.add('revealed');
      });

      if(el.id === 'feature-multi-agent' && !triggered['ma']){
        triggered['ma'] = true;
        setTimeout(initAgentLauncher, 400);
      }
      if(el.id === 'feature-token-reduction' && !triggered['tk']){
        triggered['tk'] = true;
        setTimeout(animateTokenReduction, 400);
      }
      if(el.id === 'feature-worktree' && !triggered['wt']){
        triggered['wt'] = true;
        setTimeout(animateWorkflow, 400);
      }

      revealObs.unobserve(el);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.feature-showcase').forEach(function(el){
    revealObs.observe(el);
  });

  /* ─── Video Demo ─── */
  (function(){
    var card = document.getElementById('vd-card');
    var video = document.getElementById('vd-video');
    var overlay = document.getElementById('vd-overlay');
    var playBtn = document.getElementById('vd-play-btn');
    var controls = document.getElementById('vd-controls');
    var spinner = document.getElementById('vd-spinner');
    var endOverlay = document.getElementById('vd-end-overlay');
    var replayCircle = document.getElementById('vd-replay-btn');
    var playPauseBtn = document.getElementById('vd-btn-playpause');
    var progressFill = document.getElementById('vd-progress-fill');
    var progressThumb = document.getElementById('vd-progress-thumb');
    var progressWrap = document.getElementById('vd-progress-wrap');
    var timeDisplay = document.getElementById('vd-time');
    var speedBtn = document.getElementById('vd-btn-speed');
    var fsTop = document.getElementById('vd-btn-fs-top');
    var fsBottom = document.getElementById('vd-btn-fs-bottom');
    var centerPause = document.getElementById('vd-center-pause');
    var wrap = document.getElementById('vd-video-wrap');

    if(!card || !video || !overlay || !playBtn) return;

    card.classList.add('revealed');

    var isPlaying = false;
    var isSeeking = false;
    var hideTimer = null;

    function fmt(t){
      var m = Math.floor(t/60);
      var s = Math.floor(t%60);
      return m+':'+(s<10?'0':'')+s;
    }

    function updateProgress(){
      if(!video.duration) return;
      var pct = (video.currentTime/video.duration)*100;
      progressFill.style.width = pct+'%';
      if(progressThumb) progressThumb.style.left = pct+'%';
      var cur = fmt(video.currentTime);
      var dur = fmt(video.duration);
      timeDisplay.textContent = cur+' / '+dur;
    }

    function setPlaying(state){
      isPlaying = state;
      var playIcon = playPauseBtn.querySelector('.vd-icon-play');
      var pauseIcon = playPauseBtn.querySelector('.vd-icon-pause');
      if(playIcon) playIcon.style.display = state?'none':'';
      if(pauseIcon) pauseIcon.style.display = state?'':'none';
      if(centerPause) centerPause.classList.toggle('active',!state);
    }

    function showControls(){
      if(controls) controls.classList.add('visible');
      clearTimeout(hideTimer);
      if(isPlaying){
        hideTimer = setTimeout(function(){
          if(controls) controls.classList.remove('visible');
        }, 2500);
      }
    }

    function hideControls(){
      if(controls) controls.classList.remove('visible');
    }

    function startPlayback(){
      if(!video.paused) return;
      overlay.classList.add('hidden');
      if(spinner) spinner.classList.add('active');
      video.play().then(function(){
        if(spinner) spinner.classList.remove('active');
        setPlaying(true);
        showControls();
      }).catch(function(){
        if(spinner) spinner.classList.remove('active');
      });
    }

    function togglePlay(){
      if(video.paused){
        video.play().then(function(){
          setPlaying(true);
          showControls();
        }).catch(function(){});
      } else {
        video.pause();
        setPlaying(false);
        hideControls();
      }
    }

    playBtn.addEventListener('click', function(e){
      e.stopPropagation();
      startPlayback();
    });

    if(wrap){
      wrap.addEventListener('click', function(e){
        if(e.target.closest('.vd-controls')) return;
        if(!overlay.classList.contains('hidden')) return;
        if(endOverlay && endOverlay.classList.contains('active')) return;
        togglePlay();
      });
      wrap.addEventListener('mousemove', function(){
        if(isPlaying) showControls();
      });
      wrap.addEventListener('mouseleave', function(){
        if(isPlaying) hideControls();
      });
    }

    if(playPauseBtn) playPauseBtn.addEventListener('click', function(e){
      e.stopPropagation();
      togglePlay();
    });

    if(progressWrap){
      progressWrap.addEventListener('click', function(e){
        e.stopPropagation();
        if(!video.duration) return;
        var rect = progressWrap.getBoundingClientRect();
        var x = (e.clientX - rect.left)/rect.width;
        video.currentTime = x*video.duration;
        updateProgress();
      });
    }

    video.addEventListener('timeupdate', updateProgress);

    video.addEventListener('ended', function(){
      setPlaying(false);
      hideControls();
      if(endOverlay) endOverlay.classList.add('active');
    });

    if(replayCircle) replayCircle.addEventListener('click', function(e){
      e.stopPropagation();
      video.currentTime = 0;
      endOverlay.classList.remove('active');
      if(centerPause) centerPause.classList.remove('active');
      overlay.classList.remove('hidden');
      if(spinner) spinner.classList.remove('active');
      progressFill.style.width = '0%';
      if(progressThumb) progressThumb.style.left = '0%';
      timeDisplay.textContent = '0:00 / 0:00';
    });

    /* fullscreen */
    function doFullscreen(){
      if(!wrap) return;
      if(document.fullscreenElement){
        document.exitFullscreen();
      } else {
        wrap.requestFullscreen();
      }
    }
    if(fsTop) fsTop.addEventListener('click', function(e){ e.stopPropagation(); doFullscreen(); });
    if(fsBottom) fsBottom.addEventListener('click', function(e){ e.stopPropagation(); doFullscreen(); });

    /* speed */
    var speeds = [1,1.5,2,0.5];
    var speedIdx = 0;
    if(speedBtn) speedBtn.addEventListener('click', function(e){
      e.stopPropagation();
      speedIdx = (speedIdx+1)%speeds.length;
      video.playbackRate = speeds[speedIdx];
      speedBtn.textContent = speeds[speedIdx]+'x';
    });

    /* center pause overlay */
    if(centerPause) centerPause.addEventListener('click', function(e){
      e.stopPropagation();
      togglePlay();
    });

    /* scroll reveal */
    var vdObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          card.classList.remove('revealed');
          void card.offsetWidth;
          card.classList.add('revealed');
          vdObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    vdObs.observe(card);


})();

/* ─── Feature Image Lightbox ─── */
(function(){
  var body = document.body;
  if(!body) return;
  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  var img = document.createElement('img');
  img.alt = '';
  overlay.appendChild(img);
  body.appendChild(overlay);
  var open = false;
  function show(src, alt){
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    open = true;
  }
  function hide(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    open = false;
  }
  overlay.addEventListener('click', hide);
  document.addEventListener('keydown', function(e){
    if(open && e.key === 'Escape') hide();
  });
  document.querySelectorAll('.feature-row-image img').forEach(function(el){
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function(){
      show(el.currentSrc || el.src, el.alt);
    });
  });
})();

/* ─── Hero Typing Animation (removed) ─── */

})();

})();



