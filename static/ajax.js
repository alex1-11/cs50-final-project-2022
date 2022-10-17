// https://video.cs50.io/dQcBs4S-wEQ?start=474

function ajax_request(argument)
{
    var aj = new XMLHttpRequest();
    aj.onreadystatechange = function() {
        if (aj.readyState == 4 && aj.status == 200)
            // do something to the page
    };

    aj.open("GET", /* url */, true);
    aj/send();
}