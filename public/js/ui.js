window.addEventListener('load', function() {
    var menu = document.getElementById('menu');
    var menuList = document.getElementById('menu-list');
    var toggle = document.getElementById('menu-toggle');
    var accordion = document.getElementById('menu-accordion');
    var details = document.getElementsByTagName('details');

    toggle.addEventListener('click', function() {
        menu.classList.toggle('collapsed');
        // console.log(`Toggle menu (${
        //     menu.classList.contains('collapsed') ? 'collapse': 'open'
        // })`);
    });

    accordion.addEventListener('click', function() {
        accordion.classList.toggle('opened');
        var open = accordion.classList.contains('opened');
        for(var i = 0; i < details.length; i++) {
            var detail = details[i];
            if(open) detail.setAttribute('open', 'open');
            if(!open) detail.removeAttribute('open');
        }
    });

    // Dynamically generate menu list items
    // For each details panel, get id of inner canvas
    for(var i = 0; i < details.length; i++) {
        var detail = details[i];
        var summary = detail.querySelector('summary');
        var canvas = detail.querySelector('canvas');
        var canvasId = canvas.id;
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('href', `#${canvasId}`);
        a.innerText = summary.innerText;
        li.appendChild(a);
        menuList.appendChild(li);
    }
});