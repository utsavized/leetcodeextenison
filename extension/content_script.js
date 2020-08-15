var sw = {
    etime : null,
    erst : null,
    ego : null,
    timer : null,
    now : 0,
    init : function (timer, start, reset, submit) {
      sw.etime = timer;
      sw.erst = reset;
      sw.ego = start;
      sw.esub = submit;
  
      sw.erst.addEventListener("click", sw.reset);
      sw.erst.disabled = false;
      sw.ego.addEventListener("click", sw.start);
      sw.ego.disabled = false;
      sw.esub.addEventListener("click", sw.submit);
      sw.esub.disabled = false;
    },
  
    tick : function () {
      sw.now++;
      var remain = sw.now;
      var hours = Math.floor(remain / 3600);
      remain -= hours * 3600;
      var mins = Math.floor(remain / 60);
      remain -= mins * 60;
      var secs = remain;
  
      if (hours<10) { hours = "0" + hours; }
      if (mins<10) { mins = "0" + mins; }
      if (secs<10) { secs = "0" + secs; }
      sw.etime.innerHTML = hours + ":" + mins + ":" + secs;
    },
  
    start : function () {
      sw.timer = setInterval(sw.tick, 1000);
      sw.ego.innerHTML = "Stop";
      sw.ego.removeEventListener("click", sw.start);
      sw.ego.addEventListener("click", sw.stop);
    },
  
    stop  : function () {
      clearInterval(sw.timer);
      sw.timer = null;
      sw.ego.innerHTML = "Start";
      sw.ego.removeEventListener("click", sw.stop);
      sw.ego.addEventListener("click", sw.start);
    },
  
    reset : function () {
      if (sw.timer != null) { sw.stop(); }
      sw.now = -1;
      sw.tick();
    },

    submit : function () {
        clearInterval(sw.timer);
      
        var times = window.localStorage.getItem(document.URL);
        var comma = times.length === 0 ? "" : "<br />";
        var date = new Date().toDateString();
        var timetokens = sw.etime.innerHTML.split(":");
        var timeval = Number(timetokens[0]) * 60 + Number(timetokens[1]);
        var time = timeval + "m " + timetokens[2] + "s";
        
        times += comma + date + " - " + time;
        window.localStorage.setItem(document.URL, times);

        var history = document.getElementById("lchistory");
        history.innerHTML = window.localStorage.getItem(document.URL);

        if (sw.timer != null) { sw.stop(); }
        sw.now = -1;
        sw.tick();
      }
  };

function execute() {
    var difficulty = document.querySelector('div[diff]');
    if(difficulty === null) {
        window.requestAnimationFrame(execute);
    } else {
        console.log("Difficulty - " + difficulty.getAttribute('diff') + " - removed");
        difficulty.remove();

        var question = document.querySelector("[data-cy='question-title']");
        var questionValue = question.innerText.split(".")[1];
        var parent = question.parentElement;
        question.remove();

        console.log("Adding timer")
        var lctab = document.createElement('div');
        var lcstats = document.createElement('div');
        var lctitle = document.createElement('div');
        var lchistory = document.createElement('div');
        var watch = document.createElement('div');
        var timer = document.createElement('div');
        var buttons = document.createElement('div');
        var start = document.createElement('button');
        var reset = document.createElement('button');
        var submit = document.createElement('button');
        var clear = document.createElement('div');
        lctab.setAttribute("id", "lctab");
        lcstats.setAttribute("id", "lcstats");
        lctitle.setAttribute("id", "lctitle");
        lchistory.setAttribute("id", "lchistory");
        watch.setAttribute("id", "stopwatch");
        timer.setAttribute("id", "sw-time");
        buttons.setAttribute("id", "sw-buttons");
        start.setAttribute("id", "sw-go");
        reset.setAttribute("id", "sw-rst");
        submit.setAttribute("id", "sw-sub");
        clear.setAttribute("id", "clear");
        timer.innerHTML = "00:00:00";
        start.innerHTML = "Start";
        reset.innerHTML = "Reset";
        submit.innerHTML = "Submit";
        lchistory.innerHTML = window.localStorage.getItem(document.URL) === null
            ? ""
            : window.localStorage.getItem(document.URL);
        watch.appendChild(timer);
        buttons.appendChild(start);
        buttons.appendChild(reset);
        buttons.appendChild(submit);
        watch.appendChild(buttons);
        lcstats.appendChild(lctitle);
        lcstats.appendChild(lchistory);
        lctab.appendChild(lcstats);
        lctab.appendChild(watch);
        lctab.appendChild(clear);

        lctitle.innerHTML = questionValue;
        parent.insertBefore(lctab, parent.firstChild);

        if(window.localStorage.getItem(document.URL) === null) {
            window.localStorage.setItem(document.URL, "");
        }

        sw.init(timer, start, reset, submit);
    }
};

execute();
